import * as underTest from "../dynamo";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { MappingTemplate } from "@aws-cdk/aws-appsync";

jest.mock("@aws-cdk/aws-dynamodb", () => {
	return {
		Table: function(...args) {
			this.mock = jest.fn();
			this.mock(...args);
		},
	};
});

describe("Code Generation", () => {
	describe("createDynamoTableProps", () => {
		it("should generate get the data sources for a schema", () => {
			const { expectedBlogPost, expectedComment, input } = jest.requireActual(
				"./fixtures/createDynamoTableProps.json",
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
				"./fixtures/createDynamoResolverProps.json",
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
				"./fixtures/createDynamoTableDataSource.json",
			);
			const { dataSourceProps, tableProps, resolverProps } = dynamoParams;
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
			const actual = underTest.createDynamoTableDataSource(
				scope,
				options,
				api,
				dynamoParams,
			);
			expect(actual.table.mock).toHaveBeenCalledWith(scope, ...tableProps);
			expect(actual.resolvers).toEqual(["111", "222"]);
			expect(actual.dataSource).toEqual(dataSource);
			expect(api.addDynamoDbDataSource).toHaveBeenCalledWith(
				dataSourceProps[0],
				dataSourceProps[1],
				actual.table,
			);
			expect(dataSource.createResolver).toHaveBeenCalledWith(resolverProps[0]);
			expect(dataSource.createResolver).toHaveBeenCalledWith(resolverProps[1]);
		});
	});
});
