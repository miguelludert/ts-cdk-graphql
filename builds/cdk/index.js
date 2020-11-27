const cdk = require("@aws-cdk/core");
const { join } = require("path");
const { AppSyncGqlSchema } = require("../../lib/src/index");
const app = new cdk.App();
new AppSyncGqlSchema(app, "AppSyncGqlSchema", {
	schemaFile: join(__dirname, "schema.gql"),
	lambdaSrcPath: join(__dirname, "src"),
});
