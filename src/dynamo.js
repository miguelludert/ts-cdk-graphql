import { readFileSync, writeFileSync } from "fs";
import { curry, map, endsWith, reduce, toPairs, values, pipe } from "ramda";
import { paramCase, camelCase } from "change-case";
import { Table } from "@aws-cdk/aws-dynamodb";

export const writeFile = (path, content) => {
	writeFileSync(path, content, "utf8");
	return content;
};

export const createDynamoTableProps = (key, stackName, codeGen) => {
	const tableName = paramCase(key);
	const result = {
		dataSourceProps: [
			`${tableName}-ds`,
			`A dynamo table datasource for ${stackName}`,
		],
		tableProps: [
			tableName,
			{
				tableName,
			},
		],
	};
	const {
		KeySchema,
		LocalSecondaryIndexes,
		GlobalSecondaryIndexes,
	} = codeGen.stacks[stackName].Resources[key].Properties;

	const createIndexes = map(
		({ IndexName: indexName, KeySchema: keySchema }) => ({
			indexName,
			...reduce(
				(arg, index) => {
					const keySchemaMap = ["partitionKey", "sortKey"];
					if (keySchemaMap[index]) {
						const { AttributeName, KeyType } = arg;
						schemaDefinition[keySchemaMap[index]] = {
							name: AttributeName,
							type: KeyType,
						};
					}
				},
				{},
				keySchema || [],
			),
		}),
	);
	if (GlobalSecondaryIndexes) {
		result.GSI = createIndexes(GlobalSecondaryIndexes);
	}
	if (LocalSecondaryIndexes) {
		result.LSI = createIndexes(LocalSecondaryIndexes);
	}
	return result;
};

export const createDynamoResolverProps = (key, stackName, codegen) => {
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
};

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
		const resolvers = resolverProps.map(resolverProp =>
			dataSource.createResolver(resolverProp),
		);
		return {
			table,
			dataSource,
			resolvers,
		};
	},
);
