import { getDatasourceCfn, info } from "./utils";
import { curry, defaultTo, curry } from "ramda";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { RESOURCE_TYPE_DYNAMO, DATASOURCE_TYPE_DYNAMO } from "../constants";
import * as self from "./dynamo";

export const createDynamoDataSource = (scope, stackProps, api, cfSchema) => {
	info("createDynamoDataSource");
	const datasourceCfn = getDatasourceCfn(
		DATASOURCE_TYPE_DYNAMO,
		cfSchema
	);
	const bob = datasourceCfn.map(self.createSingleDynamoTableProp(stackProps));
	const datasources = bob.map(self.createDynamoResources(scope, api));
	return datasources;
};

export const createDynamoResources = curry((scope, api, props) => {
	info("createDynamoResources");
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

export const createSingleDynamoTableProp = curry(
	(props, { stackName, resourcePairs, datasourceName, datasourceCfn }) => {
		info("createSingleDynamoTableProp");
		const [tableNameRaw, tableCfn] = resourcePairs.find(
			([resourceName, resourceCfn]) => resourceCfn.Type == RESOURCE_TYPE_DYNAMO,
		);

		let tableName = `${tableNameRaw}-table`;
		if(props && props.namingConvention) { 
			tableName = props.namingConvention(tableNameRaw, 'table');
		}

		const {
			DeletionPolicy,
			KeySchema,
			AttributeDefinitions,
			LocalSecondaryIndexes,
			GlobalSecondaryIndexes,
		} = tableCfn.Properties;
		const result = {
			stackName,
			datasourceCfn,
			datasourceName,
			tableCfn,
			tableName,
			tableProps: {
				tableName,
				...getDynamoAttributeProps(KeySchema, AttributeDefinitions),
				removalPolicy: DeletionPolicy,
			},
			...self.getIndex("GSI", GlobalSecondaryIndexes),
			...self.getIndex("LSI", LocalSecondaryIndexes),
		};
		return result;
	},
);

export const getDynamoAttributeProps = (keySchema, attributeDefinitions) => {
	info("getDynamoAttributeProps");
	const result = {};
	const getAttributeTypes = (name) => {
		const attr = attributeDefinitions.find((x) => x.AttributeName == name);
		return {
			S: AttributeType.STRING,
			N: AttributeType.NUMBER,
			B: AttributeType.BINARY,
		}[attr.AttributeType];
	};
	if (keySchema[0]) {
		result.partitionKey = {
			name: keySchema[0].AttributeName,
			type: getAttributeTypes(keySchema[0].AttributeName),
		};
	}
	if (keySchema[1]) {
		result.sortKey = {
			name: keySchema[1].AttributeName,
			type: getAttributeTypes(keySchema[1].AttributeName),
		};
	}
	return result;
};

export const getIndex = defaultTo({}, (name, attributeDefinitions, indexes) => {
	info("getIndex");
	if (indexes) {
		return {
			[name]: indexes.map(({ IndexName, KeySchema, Projection }) => ({
				indexName: IndexName,
				projectionType: Projection && Projection.ProjectionType,
				...self.getDynamoAttributeProps(KeySchema, attributeDefinitions),
			})),
		};
	}
});
