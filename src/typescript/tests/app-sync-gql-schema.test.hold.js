import { App } from "@aws-cdk/core";
import {
	AppSyncGqlSchema,
	getCfSchema,
	getProviders,
	createResources,
	getSchemaText,
} from "../app-sync-gql-schema";
import { datasourceProviders } from "../datasource-providers";
import { NO_SCHEMA_ERROR_MESSAGE } from "../constants";

jest.mock("fs");

describe("app-syng-gql-schema-stack", () => {
	describe("getSchemaText", () => {
		const { readFileSync } = jest.requireMock("fs");
		beforeEach(() => {
			readFileSync.mockClear();
		});
		it("should fail if no schema is passed in", () => {
			expect(() => getSchemaText({})).toThrowError(NO_SCHEMA_ERROR_MESSAGE);
		});
		it("should read a schema from file", () => {
			const schemaFile = "/path/to/schema/file";
			const expected = "expected value";
			readFileSync.mockReturnValue(expected);
			const actual = getSchemaText({ schemaFile });
			expect(actual).toEqual(expected);
			expect(readFileSync).toHaveBeenCalledWith(schemaFile, "utf8");
		});
		it("should return a schema from props", () => {
			const schemaText = "my schema text";
			const actual = getSchemaText({ schemaText });
			expect(actual).toEqual(schemaText);
			expect(readFileSync).not.toHaveBeenCalled();
		});
	});
	describe("getProviders", () => {
		it("should get default providers without injected providers", () => {
			const actual = getProviders({});
			expect(actual).toEqual(datasourceProviders);
		});
		it("should get default providers with injected providers", () => {
			const providers = [
				{
					getTransformer: jest.fn(),
					createResources: jest.fn(),
				},
			];
			const actual = getProviders({
				datasourceProviders: providers,
			});
			const expected = [...datasourceProviders, ...providers];
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
			const actual = createResources(scope, props, api, providers, cfSchema);
			expect(actual).toEqual(expected);
		});
	});
});
