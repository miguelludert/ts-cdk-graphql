import { paramCase, camelCase } from "change-case";
import { curry, props, defaultTo } from "ramda";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { MappingTemplate, BaseResolverProps } from "@aws-cdk/aws-appsync";
import {
	dump,
	filterResourcePairsByType,
	makeDatasourceName,
	makeTableName,
} from "../utils";
import {
	RESOURCE_TYPE_DYNAMO,
	RESOURCE_TYPE_DATASOURCE,
} from "../../constants";
import * as self from "./create-props";

// export const getDynamoDataSources = (options, cfnSchema) => {
// 	console.info("getDynamoDataSources");
// 	const stacks = toPairs(codeGen.stacks);
// 	const tables = stackMapping.filter(([key,value]) => {
// 		return value.Type === RESOURCE_TYPE_DATASOURCE && value.Properties.Type === DATASOURCE_TYPE_DYNAMO;
// 	});
// 	return tables.map(([key, value]) => ({
// 		...createDynamoTableProps(key, stackName, cfnSchema),
// 		...createDynamoResolverProps(key, stackName, cfnSchema),
// 	}));
// };

export const createDynamoTableProps = (cfnSchema) => {
	// get dynamo resources by stack
	const result = Object.entries(cfnSchema.stacks).reduce(
		(acc, [stackName, stackCfn]) => {
			const resourcePairs = Object.entries(stackCfn.Resources);
			const datasourcePairs = resourcePairs.find(
				([resourceName, resourceCfn]) => {
					const isDatasource = resourceCfn.Type === RESOURCE_TYPE_DATASOURCE;
					const isDynamo = resourceCfn.Properties.Type === "AMAZON_DYNAMODB";
					return isDatasource && isDynamo;
				});
			if(datasourcePairs) {
				const props = self.createSingleDynamoTableProp(stackName, resourcePairs, datasourcePairs);
				acc.push(props);
			}
			return acc;
		},[]);
	return result;
};

export const createSingleDynamoTableProp = curry(
	(stackName, resourcePairs,[datasourceName,datasourceCfn]) => {
		const [tableName,tableCfn] = resourcePairs.find(
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
