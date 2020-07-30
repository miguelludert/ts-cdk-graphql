import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { MappingTemplate } from "@aws-cdk/aws-appsync";
import { curry } from "ramda";
import codegen from "./fixtures/codegen.json";

// this is an experimental function to enable mocking within the same file as the invoked function
export const prepModule = name => {
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

jest.mock("@aws-cdk/aws-dynamodb", () => {
	const dynamoModule = jest.requireActual("@aws-cdk/aws-dynamodb");
	return {
		...dynamoModule,
		Table: function(...args) {
			this.mock = jest.fn();
			this.mock(...args);
			this.addGlobalSecondaryIndex = jest.fn();
			this.addLocalSecondaryIndex = jest.fn();
		},
	};
});

describe("Code Generation", () => {
	const { mock, underTest } = prepModule("../dynamo");

	describe("createDynamoTableProps", () => {
		it("should generate get the data sources for a schema", () => {
			const { expectedBlogPost, expectedComment, input } = jest.requireActual(
				"./fixtures/dynamo.createDynamoTableProps.json",
			);
			const actualBlogPost = underTest.createDynamoTableProps(
				"BlogPostTable",
				"BlogPost",
				input,
			);
			const actualComment = underTest.createDynamoTableProps(
				"CommentTable",
				"Comment",
				input,
			);
			expect(actualBlogPost).toEqual(expectedBlogPost);
			expect(actualComment).toEqual(expectedComment);
		});
	});
	describe("createDynamoResolverProps", () => {
		it("should gather the dynamo resolvers", () => {
			const { expected, input } = jest.requireActual(
				"./fixtures/dynamo.createDynamoResolverProps.json",
			);
			const actual = underTest.createDynamoResolverProps(
				"BlogPostTable",
				"BlogPost",
				input,
			);
			expect(actual).toEqual(expected);
		});
	});
	describe("createDynamoTableDataSource", () => {
		it("should create a cdk table and datasource for a configuration ", () => {
			const { scope, options, dynamoParams } = jest.requireActual(
				"./fixtures/dynamo.createDynamoTableDataSource.json",
			);
			const {
				dataSourceName,
				description,
				dataSourceProps,
				tableProps,
				resolverProps,
				GSI,
				LSI,
			} = dynamoParams;
			const api = {
				addDynamoDbDataSource: jest.fn(),
			};
			const dataSource = {
				createResolver: jest
					.fn()
					.mockReturnValueOnce("111")
					.mockReturnValueOnce("222"),
			};
			api.addDynamoDbDataSource.mockReturnValue(dataSource);
			const { createDynamoBaseResolverProps } = underTest;
			const actual = underTest.createDynamoTableDataSource(
				scope,
				options,
				api,
				dynamoParams,
			);
			expect(actual.table.mock).toHaveBeenCalledWith(
				scope,
				dataSourceName,
				tableProps,
			);
			expect(actual.table.addLocalSecondaryIndex).toHaveBeenCalledWith(LSI[0]);
			expect(actual.table.addGlobalSecondaryIndex).toHaveBeenCalledWith(GSI[0]);
			expect(actual.resolvers).toEqual(["111", "222"]);
			expect(actual.dataSource).toEqual(dataSource);
			expect(api.addDynamoDbDataSource).toHaveBeenCalledWith(
				dataSourceName,
				description,
				actual.table,
			);
			expect(dataSource.createResolver).toHaveBeenCalledWith(
				createDynamoBaseResolverProps(resolverProps[0]),
			);
			expect(dataSource.createResolver).toHaveBeenCalledWith(
				createDynamoBaseResolverProps(resolverProps[1]),
			);
		});
	});
	describe("getDynamoAttributeProps", () => {
		it("should attribute props from name and properties", () => {
			const { AttributeType } = jest.requireActual("@aws-cdk/aws-dynamodb");
			const keySchema = [
				{ AttributeName: "StringKey" },
				{ AttributeName: "NumberKey" },
				{ AttributeName: "BinaryKey" },
			];
			const attributeDefinitions = [
				{
					AttributeName: "StringKey",
					AttributeType: "S",
				},
				{
					AttributeName: "NumberKey",
					AttributeType: "N",
				},
				{
					AttributeName: "BinaryKey",
					AttributeType: "B",
				},
			];
			const expected = {
				partitionKey: { name: "StringKey", type: AttributeType.STRING },
				sortKey: { name: "NumberKey", type: AttributeType.NUMBER },
			};
			const actual = underTest.getDynamoAttributeProps(
				keySchema,
				attributeDefinitions,
			);
			expect(actual).toEqual(expected);
		});
	});

	describe("getDynamoDataSources", () => {
		it("should create parameters", () => {
			const codegen = {
				stackMapping: {
					BlogPost: "BlogPost",
					BlogPostTable: "BlogPost",
					Comment: "Comment",
					CommentTable: "Comment",
				},
			};
			const expected = [
				{
					dynamoProps: "BlogPostTable:BlogPost",
					resolverProps: "BlogPostTable:BlogPost",
				},
				{
					dynamoProps: "CommentTable:Comment",
					resolverProps: "CommentTable:Comment",
				},
			];
			const params = jest.requireMock("../dynamo");
			const paramImpl = curry((name, key, value) => ({
				[name]: `${key}:${value}`,
			}));
			params.createDynamoTableProps.mockImplementation(
				paramImpl("dynamoProps"),
			);
			params.createDynamoResolverProps.mockImplementation(
				paramImpl("resolverProps"),
			);
			const actual = underTest.getDynamoDataSources(null, codegen);
			expect(actual).toEqual(expected);
		});
	});
});
