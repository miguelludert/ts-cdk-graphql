import { AWS_APPSYNC_DATASOURCE } from "../constants";

export const filterDataSourcesOfType = (cfSchema, type) => {
	const stackPairs = Object.entries(cfSchema.stacks);
	const filteredPairs = stackPairs.filter(([, stack]) => {
		const resourcePairs = Object.entries(stack.Resources);
		const result = resourcePairs.some(([, resource]) => {
			return (
				resource.Type === AWS_APPSYNC_DATASOURCE &&
				resource.Properties.Type === type
			);
		});
		return result;
	});
	const result = Object.fromEntries(filteredPairs);
	return result;
};

//   "BlogDataSource": {
//     "Type": "AWS::AppSync::DataSource",
//     "Properties": {
//       "ApiId": {
//         "Ref": "GetAttGraphQLAPIApiId"
//       },
//       "Name": "BlogTable",
//       "Type": "AMAZON_DYNAMODB",
//       "ServiceRoleArn": {
//         "Fn::GetAtt": [
//           "BlogIAMRole",
//           "Arn"
//         ]
//       },
// };
