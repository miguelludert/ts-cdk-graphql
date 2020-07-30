import { readFileSync, writeFileSync } from "fs";
import {
	defaultTo,
	curry,
	filter,
	map,
	endsWith,
	reduce,
	toPairs,
	values,
	pipe,
} from "ramda";
import { paramCase, camelCase } from "change-case";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { MappingTemplate, BaseResolverProps } from "@aws-cdk/aws-appsync";
import * as self from "./dynamo";

export const writeFile = (path, content) => {
	writeFileSync(path, content, "utf8");
	return content;
};

export const getDynamoAttributeProps = (keySchema, attributeDefinitions) => {
	const result = {};
	const getAttributeTypes = name => {
		const attr = attributeDefinitions.find(x => x.AttributeName == name);
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

export const createDynamoTableProps = (key, stackName, codeGen) => {
	const {
		AttributeDefinitions,
		KeySchema,
		LocalSecondaryIndexes,
		GlobalSecondaryIndexes,
	} = codeGen.stacks[stackName].Resources[key].Properties;
	const tableName = paramCase(key);
	const getIndex = defaultTo({}, (indexes, name) => {
		if (indexes) {
			return {
				[name]: indexes.map(({ IndexName, KeySchema, Projection }) => ({
					indexName: IndexName,
					projectionType: Projection && Projection.ProjectionType,
					...getDynamoAttributeProps(KeySchema, AttributeDefinitions),
				})),
			};
		}
	});
	const result = {
		dataSourceName: camelCase(key), // must be in camel case,
		description: `A dynamo table datasource for ${stackName}`,
		tableProps: {
			tableName,
			...getDynamoAttributeProps(KeySchema, AttributeDefinitions),
		},
		...getIndex(GlobalSecondaryIndexes, "GSI"),
		...getIndex(LocalSecondaryIndexes, "LSI"),
	};
	return result;
};

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

export const createDynamoBaseResolverProps = resolverProp => ({
	typeName: resolverProp.typeName,
	fieldName: resolverProp.fieldName,
	requestMappingTemplate: MappingTemplate.fromString(
		resolverProp.requestMappingTemplate,
	),
	responseMappingTemplate: MappingTemplate.fromString(
		resolverProp.responseMappingTemplate,
	),
});

export const createDynamoTableDataSource = curry(
	(scope, options, api, dynamoParams) => {
		const {
			resolverProps,
			dataSourceName,
			description,
			dataSourceProps,
			tableProps,
		} = dynamoParams;
		const { prefix } = options || {};
		const table = new Table(scope, dataSourceName, tableProps);
		const dataSource = api.addDynamoDbDataSource(
			dataSourceName,
			description,
			table,
		);
		if (dynamoParams.GSI) {
			dynamoParams.GSI.map(index => table.addGlobalSecondaryIndex(index));
		}
		if (dynamoParams.LSI) {
			dynamoParams.LSI.map(index => table.addLocalSecondaryIndex(index));
		}
		const resolvers = resolverProps.map(resolverProp => {
			const modifiedProp = { resolverProp };
			return dataSource.createResolver(
				createDynamoBaseResolverProps(resolverProp),
			);
		});
		return {
			table,
			dataSource,
			resolvers,
		};
	},
);

export const getDynamoDataSources = (options, codeGen) => {
	const stackMapping = toPairs(codeGen.stackMapping);
	const tables = stackMapping.filter(([key]) => key.endsWith("Table"));
	return tables.map(([key, stackName]) => ({
		...self.createDynamoTableProps(key, stackName, codeGen),
		...self.createDynamoResolverProps(key, stackName, codeGen),
	}));
};
