import { GraphQLTransform } from "graphql-transformer-core";
import { DynamoDBModelTransformer } from "graphql-dynamodb-transformer";
import { SearchableModelTransformer } from "graphql-elasticsearch-transformer";
import { ModelConnectionTransformer } from "graphql-connection-transformer";
import { ModelAuthTransformer } from "graphql-auth-transformer";
import { VersionedModelTransformer } from "graphql-versioned-transformer";
import { KeyTransformer } from "graphql-key-transformer";
import { readFileSync, writeFileSync } from "fs";
import { map, endsWith, reduce, toPairs } from "ramda";
import { paramCase, camelCase } from "change-case";
import * as dynamo from "./dynamo";

export const getDynamoProps = codeGen => {
	const stackMapping = toPairs(codeGen.stackMapping);
	const tables = stackMapping.filter(([key]) => key.endsWith("Table"));
	return tables.map(([key, stackName]) => {
		const result = {
			...dynamo.createDynamoTableProps(key, stackName, codeGen),
			...dynamo.createDynamoResolverProps(key, stackName, codeGen),
		};
		return result;
	});
};

export const getCodeGenSchema = (options, schema) => {
	const transformers = (options && options.transformers) || [];
	const transformer = new GraphQLTransform({
		transformers: [
			new DynamoDBModelTransformer(),
			new ModelAuthTransformer(),
			new KeyTransformer(),
			new VersionedModelTransformer(),
			new ModelConnectionTransformer(),
			...transformers,
		],
	});
	const codeGenSchema = transformer.transform(schema);
	return codeGenSchema;
};

export const readSchema = path => readFileSync(path, "utf8");

export class AppsyncGQLStack {
	constructor(scope, props) {
		// read schema
		const schema = readSchema(options.schema);
		const codegen = getCodeGenSchema(props, schema);
		const dynamoProps = getDynamoProps(codegen);
		const api = new AppsyncApi();
		const dynamoStack = dynamo.createDynamoTableDataSource(
			this,
			props,
			api,
			dynamoProps,
		);
	}
}
