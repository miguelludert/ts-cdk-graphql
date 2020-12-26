import { createDynamoTableProps, createDynamoTableProps } from "./create-props";
import { toPairs, fromPairs, curry } from "ramda";
import { Table } from "@aws-cdk/aws-dynamodb";
import * as self from './index';

export const createDynamoDataSource = curry((scope, api, props) => {
	const { datasourceName, tableProps } = props;
	const table = new Table(scope, tableProps.tableName, tableProps);
	const datasource = api.addDynamoDbDataSource(datasourceName, table, {
		description: datasourceName,
		name: datasourceName,
	});
	if (props.GSI) {
		props.GSI.map((index) => table.addGlobalSecondaryIndex(index));
	}
	if (props.LSI) {
		props.LSI.map((index) => table.addLocalSecondaryIndex(index));
	}
	const result = {
		table,
		datasource,
		...props,
	};
	return result;
});

export const createDynamoResources = (scope, api, cfSchema) => {
	const tableProps = createDynamoTableProps(cfSchema);
	const resources = tableProps.map(self.createDynamoDataSource(scope, api));
	return resources;
};
