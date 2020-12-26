import { createDatasourceProps } from "../utils";
import { curry, defaultTo, curry } from "ramda";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import * as self from "./index";
import { RESOURCE_TYPE_DYNAMO, DATASOURCE_TYPE_DYNAMO } from "../../constants";
import * as self from "./index";

export const createDynamoDataSource = (scope, api, cfSchema) => {
	const datasourceProps = createDatasourceProps(
		createSingleDynamoTableProp,
		DATASOURCE_TYPE_DYNAMO,
		cfSchema,
	);
	const datasources = datasourceProps.map(
		self.createDynamoResources(scope, api),
	);
	return datasources;
};

export const createDynamoResources = curry((scope, api, props) => {
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
	({ stackName, resourcePairs, datasourceName, datasourceCfn }) => {
		const [tableName, tableCfn] = resourcePairs.find(
			([resourceName, resourceCfn]) => resourceCfn.Type == RESOURCE_TYPE_DYNAMO,
		);
		const {
			DeletionPolicy,
			KeySchema,
			AttributeDefinitions,
			LocalSecondaryIndexes,
			GlobalSecondaryIndexes,
		} = tableCfn.Properties;
		const props = {
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
		return props;
	},
);

export const getDynamoAttributeProps = (keySchema, attributeDefinitions) => {
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
