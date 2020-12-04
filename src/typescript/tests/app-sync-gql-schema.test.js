import { GraphQLApi } from "@aws-cdk/aws-appsync";
import { App, Construct } from "@aws-cdk/core";
import { NO_SCHEMA_ERROR_MESSAGE } from "../../constants";
import { I_DatasourceProvider } from "../interfaces";

jest.mock("graphql-transformer-core");
jest.mock("../utils", () => {
	const actual = jest.requireActual("../utils");
	return {
		...actual,
		readFileSync: jest.fn(),
		createConstruct: jest.fn(),
	};
});

// this is an experimental function to enable mocking within the same file as the invoked function
export const prepModule = (name) => {
	jest.mock(name);
	const mock = jest.requireMock(name);
	const underTest = jest.requireActual(name);
	beforeEach(() => {
		jest.resetAllMocks();
	});
	return {
		mock,
		underTest,
	};
};

describe("app-syng-gql-schema-stack", () => {
	const { mock, underTest } = prepModule("../app-sync-gql-schema");
	describe("getSchemaText", () => {
		const { readFileSync } = require("../utils");
		beforeEach(() => {
			readFileSync.mockClear();
		});
		it("should fail if no schema is passed in", () => {
			expect(() => underTest.getSchemaText({})).toThrowError(
				NO_SCHEMA_ERROR_MESSAGE,
			);
		});
		it("should read a schema from file", () => {
			const schemaFile = "/path/to/schema/file";
			const expected = "expected value";
			readFileSync.mockReturnValue(expected);
			const actual = underTest.getSchemaText({ schemaFile });
			expect(actual).toEqual(expected);
			expect(readFileSync).toHaveBeenCalledWith(schemaFile, "utf8");
		});
		it("should return a schema from props", () => {
			const schemaText = "my schema text";
			const actual = underTest.getSchemaText({ schemaText });
			expect(actual).toEqual(schemaText);
			expect(readFileSync).not.toHaveBeenCalled();
		});
	});
	describe("getProviders", () => {
		it("should get default providers without injected providers", () => {
			const actual = underTest.getProviders({});
			expect(actual).toEqual(underTest.defaultDatasourceProviders);
		});
		it("should get default providers with injected providers", () => {
			const providers = [
				{
					getTransformer: jest.fn(),
					createResources: jest.fn(),
				},
			];
			const actual = underTest.getProviders({
				datasourceProviders: providers,
			});
			const expected = [...underTest.defaultDatasourceProviders, ...providers];
			expect(actual).toEqual(expected);
		});
	});
	describe("createResources", () => {
		it("should create resources from ", () => {
			const scope = "scope";
			const cfSchema = "cfSchema";
			const props = "props";
			const api = "api";
			const providers = [
				{ createResources: jest.fn().mockReturnValue({ stacks: { one: 1 } }) },
				{ createResources: jest.fn().mockReturnValue({ stacks: { two: 2 } }) },
				{
					createResources: jest.fn().mockReturnValue({ stacks: { three: 3 } }),
				},
			];
			const expected = {
				stacks: {
					one: 1,
					two: 2,
					three: 3,
				},
			};
			const actual = underTest.createResources(
				scope,
				props,
				api,
				providers,
				cfSchema,
			);
			expect(actual).toEqual(expected);
		});
	});
	describe("getCfSchema", () => {
		it("should turn text into ", () => {
			const schemaText = "schema text";
			const props = {
				prop1: "prop 1",
			};
			const providers = [
				{ getTransformer: () => ["provider 1"] },
				{ getTransformer: () => ["provider 2"] },
			];
			const transformers = { transformers: ["provider 1", "provider 2"] };
			const expected = "expected";
			const { GraphQLTransform } = jest.requireMock("graphql-transformer-core");
			const transform = jest.fn().mockReturnValue(expected);
			GraphQLTransform.mockImplementation(() => ({
				transform,
			}));
			mock.getSchemaText.mockReturnValue(schemaText);
			const actual = underTest.getCfSchema(props, providers);
			expect(actual).toEqual(expected);
			expect(GraphQLTransform).toHaveBeenCalledWith(transformers);
			expect(transform).toHaveBeenCalledWith(schemaText);
		});
	});
	describe("createApi", () => {
		it("should create an CDK GraphQL API", () => {
			const { createConstruct } = jest.requireMock("../utils");
			const name = "graphql-api";
			const resourceName = "graphql-api";
			const scope = { scope: "scope" };
			const schema = "schema";
			const props = { name, schema };
			const expected = "expected";
			createConstruct.mockReturnValue(expected);
			const actual = underTest.createApi(scope, schema);
			expect(actual).toEqual(expected);
			expect(createConstruct).toHaveBeenCalledWith(
				scope,
				props,
				GraphQLApi,
				"graphql-api",
			);
		});
	});

	describe("AppSyncGqlSchema", () => {
		it("should create a new construct", ()=> { 
			const props = {
				environment: {
					ENV_VAR : "env var"
				},
				context: "context",
				prefix: "prefix",
				schemaFile: "schemaFile",
				schemaText: "schemaText",
				defaultsDirectory: "string",
				overridesDirectory: "string",
				defaults: "defaults",
				overrides: "overrides",
				datasourceProviders: "datasourceProviders"
			};
			const scope = new App({});
			const name = "providers";
			const providers = "providers";
			const cfSchema = "cfSchema";

			mock.getProviders.mockReturnValue(providers);
			mock.getCfSchema.mockReturnValue(cfSchema);
			const actual = new underTest.AppSyncGqlSchema(scope, name, props);
			expect(mock.getProviders).toHaveBeenCalledWith(props);
			expect(mock.getCfSchema).toHaveBeenCalledWith(props, providers);
		})
	})
});
