import * as underTest from "../index";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { curry } from "ramda";

jest.mock("../dynamo");

describe("Index", () => {
	describe("getCodeGenSchema", () => {
		it("should generate a schema", () => {
			const gqlSchema = readFileSync(
				join(__dirname, "./fixtures/index.getCodeGenSchema.gql"),
				"utf8",
			);
			const options = {};
			const actual = underTest.getCodeGenSchema(options, gqlSchema);
			delete actual.rootStack; // don't care about the root stack
			expect(actual).toMatchSnapshot();
		});
	});

	describe("getDynamoProps", () => {
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
			const actual = underTest.getDynamoProps(codegen);
			expect(actual).toEqual(expected);
		});
	});
});
