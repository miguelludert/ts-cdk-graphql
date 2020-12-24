import {
	createDynamoResolverProps,
	createDynamoTableProps,
} from "./create-props";
import { toPairs, fromPairs } from "ramda";
import { Table } from "@aws-cdk/aws-dynamodb";

export const createDynamoDataSource = (scope, api, props) => {
	console.info(props)
		const {
			resolverProps,
			dataSourceName,
			tableProps,
		} = props;
		const table = new Table(scope, tableProps.tableName, tableProps);
		const dataSource = api.addDynamoDbDataSource(
			dataSourceName,
			table,
			{
				description : dataSourceName,
				name : dataSourceName
			}
		);
		if (props.GSI) {
			props.GSI.map((index) => table.addGlobalSecondaryIndex(index));
		}
		if (props.LSI) {
			props.LSI.map((index) => table.addLocalSecondaryIndex(index));
		}
		console.info(1);
		// const resolvers = resolverProps.map((resolverProp) => {
		// 	const modifiedProp = { resolverProp };
		// 	return dataSource.createResolver(createBaseResolverProps(resolverProp));
		// });
		console.info(2);
		return {
			table,
			dataSource,
			resolvers,
		};
	};

