const cdk = require("@aws-cdk/core");
const { join } = require("path");
const { AppsyncGQLSchemaStack } = require("../../src/index.ts");
const app = new cdk.App();
new AppsyncGQLSchemaStack(app, "AppsyncGQLSchemaStack", {
	schemaPath: join(__dirname, "schema.gql"),
	lambdaSrcPath: join(__dirname, "src"),
});
