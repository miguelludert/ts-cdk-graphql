const cdk = require("@aws-cdk/core");
const { join } = require("path");
const { AppsyncGQLSchemaStack } = require("../../src");

// class CdkStack extends cdk.Stack {
// 	/**
// 	 *
// 	 * @param {cdk.Construct} scope
// 	 * @param {string} id
// 	 * @param {cdk.StackProps=} props
// 	 */
// 	constructor(scope, id, props) {
// 		super(scope, id, props);
//
// 		new AppsyncGQLSchemaStack
// 	}
// }

const app = new cdk.App();
new AppsyncGQLSchemaStack(app, "AppsyncGQLSchemaStack", {
	schema: join(__dirname, "schema.gql"),
});
