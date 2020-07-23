require("@babel/register");
const cdk = require("@aws-cdk/core");
const { join } = require("path");
const { mkdirSync, writeFileSync } = require("fs");
const {
	AppsyncGQLSchemaStack,
	getDynamoProps,
	getCodeGenSchema,
	readSchema,
} = require("../../src");

const schema = join(__dirname, "schema.gql");
const schemaText = readSchema(schema);
const codegen = getCodeGenSchema({}, schemaText);
const dynamoProps = getDynamoProps(codegen);

writeFileSync(
	join(__dirname, "props.json"),
	JSON.stringify(dynamoProps, null, 2),
);

const app = new cdk.App();
new AppsyncGQLSchemaStack(app, "test", {
	schema,
});
