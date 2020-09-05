import * as underTest from "../index";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
const cdk = require("@aws-cdk/core");

describe("Index", () => {
	describe("getCodeGenSchema", () => {
		it("should generate a schema", () => {
			const schemaText = readFileSync(
				join(__dirname, "./fixtures/schema.gql"),
				"utf8",
			);
			const options = {};
			const actual = underTest.getCodeGenSchema(options, schemaText);
			delete actual.rootStack; // don't care about the root stack
			expect(actual).toMatchSnapshot();
		});
	});
	describe("AppsyncGQLSchemaStack", () => {
		it("should instantiate with a valid schema", () => {
			const schemaText = readFileSync(
				join(__dirname, "./fixtures/schema.gql"),
				"utf8",
			);
			const app = new cdk.App();
			new underTest.AppsyncGQLSchemaStack(app, "test", {
				schemaText,
			});
		});
	});
	describe("getDynamoStack", () => {
		it("should", () => {
			throw "not implemented";
		});
	});
	describe("getFunctionStack", () => {
		it("should", () => {
			throw "not implemented";
		});
	});
});
