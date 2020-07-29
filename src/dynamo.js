import { readFileSync, writeFileSync } from "fs";
import {
	defaultTo,
	curry,
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
		dataSourceProps: [
			camelCase(tableName),
			`A dynamo table datasource for ${stackName}`,
		],
		tableProps: [
			tableName,
			{
				tableName,
				...getDynamoAttributeProps(KeySchema, AttributeDefinitions),
			},
		],
		...getIndex(GlobalSecondaryIndexes, "GSI"),
		...getIndex(LocalSecondaryIndexes, "LSI"),
	};
	return result;
};

export const createDynamoResolverProps = curry((key, stackName, codegen) => {
	const reducer = (acc, [key, template]) => {
		const [typeName, fieldName, type] = key.split(".");
		const accKey = `${typeName}.${fieldName}`;
		let obj = acc[accKey];
		if (!obj) {
			obj = {
				typeName,
				fieldName,
			};
		}
		const typeFieldName = {
			req: "requestMappingTemplate",
			res: "responseMappingTemplate",
		};
		obj[typeFieldName[type]] = template;
		acc[accKey] = obj;
		return acc;
	};
	const resolverProps = pipe(
		toPairs,
		reduce(reducer, {}),
		values,
	)(codegen.resolvers);
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
		const { resolverProps, dataSourceProps, tableProps } = dynamoParams;
		const { prefix } = options || {};
		const table = new Table(scope, ...tableProps);
		const dataSource = api.addDynamoDbDataSource(
			dataSourceProps[0],
			dataSourceProps[1],
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
