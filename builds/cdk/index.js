const cdk = require("@aws-cdk/core");
const { join } = require("path");
const { AppsyncGQLSchemaStack } = require("../../.output");
const app = new cdk.App();
new AppsyncGQLSchemaStack(app, "AppsyncGQLSchemaStack", {
	schema: join(__dirname, "schema.gql"),
});
