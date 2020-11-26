import { paramCase, camelCase } from "change-case";
import { curry, props, defaultTo } from "ramda";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { MappingTemplate, BaseResolverProps } from "@aws-cdk/aws-appsync";
import { filterResourcePairsByType } from "../utils";
import { RESOURCE_TYPE_DYNAMO } from "../../constants";
import * as self from "./create-props";

export const createDynamoTableProps = (cfnSchema) => {
	// get dynamo resources by stack
	return Object.entries(cfnSchema.stacks).reduce((acc, [name, stack]) => {
        const resourcePairs = Object.entries(stack.Resources);
        const resources = filterResourcePairsByType(resourcePairs, RESOURCE_TYPE_DYNAMO);
		if (resources.length) {
			acc[name] = resources.map(self.createSingleDynamoTableProp(name));
		}
		return acc;
	}, {});
};

export const createSingleDynamoTableProp = curry((name, resource) => {
	if (resource.Type != RESOURCE_TYPE_DYNAMO) {
		throw new Error(`Resource type does not match ${RESOURCE_TYPE_DYNAMO}`);
	}
	const {
		DeletionPolicy,
		KeySchema,
		AttributeDefinitions,
		LocalSecondaryIndexes,
		GlobalSecondaryIndexes,
	} = resource.Properties;
	const props = {
		dataSourceName: `${camelCase(name)}`,
		tableProps: {
			tableName: `${paramCase(name)}`,
			...getDynamoAttributeProps(KeySchema, AttributeDefinitions),
			removalPolicy: DeletionPolicy,
		},
		...self.getIndex("GSI", GlobalSecondaryIndexes),
		...self.getIndex("LSI", LocalSecondaryIndexes),
	};
	return props;
});

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

export const createDynamoResolverProps = curry((key, stackName, codegen) => {
	const reducer = (acc, [key, value]) => {
		const fieldName = value.Properties.FieldName;
		const typeName = value.Properties.TypeName;
		const accKey = `${typeName}.${fieldName}`;
		acc[`${accKey}`] = {
			typeName,
			fieldName,
			requestMappingTemplate: codegen.resolvers[`${accKey}.req.vtl`],
			responseMappingTemplate: codegen.resolvers[`${accKey}.res.vtl`],
		};
		return acc;
	};
	const resolverProps = pipe(
		toPairs,
		filter(([key, value]) => value.Type == "AWS::AppSync::Resolver"),
		reduce(reducer, {}),
		values,
	)(codegen.stacks[stackName].Resources);
	return {
		resolverProps,
	};
});