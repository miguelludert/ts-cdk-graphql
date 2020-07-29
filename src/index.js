import { GraphQLTransform } from "graphql-transformer-core";
import { DynamoDBModelTransformer } from "graphql-dynamodb-transformer";
import { ModelConnectionTransformer } from "graphql-connection-transformer";
import { ModelAuthTransformer } from "graphql-auth-transformer";
import { FunctionTransformer } from "graphql-function-transformer";
import { KeyTransformer } from "graphql-key-transformer";
import { readFileSync, writeFileSync } from "fs";
import { map, endsWith, reduce, toPairs } from "ramda";
import { paramCase, camelCase } from "change-case";
import * as dynamo from "./dynamo";
import { Stack } from "@aws-cdk/core";
import { GraphQLApi } from "@aws-cdk/aws-appsync";

export const getDynamoProps = codeGen => {
	const stackMapping = toPairs(codeGen.stackMapping);
	const tables = stackMapping.filter(([key]) => key.endsWith("Table"));
	return tables.map(([key, stackName]) => ({
		...dynamo.createDynamoTableProps(key, stackName, codeGen),
		...dynamo.createDynamoResolverProps(key, stackName, codeGen),
	}));
};

export const getCodeGenSchema = (options, schema) => {
	const transformers = (options && options.transformers) || [];
	const transformer = new GraphQLTransform({
		transformers: [
			new DynamoDBModelTransformer(),
			new ModelAuthTransformer(),
			new KeyTransformer(),
			new ModelConnectionTransformer(),
			new FunctionTransformer(),
			...transformers,
		],
	});
	const codeGenSchema = transformer.transform(schema);
	return codeGenSchema;
};

export const readSchema = path => readFileSync(path, "utf8");

export class AppsyncGQLSchemaStack extends Stack {
	constructor(scope, name, props) {
		// read schema
		super(scope, name, props);
		const schema = readSchema(props.schema);
		const codegen = getCodeGenSchema(props, schema);
		const dynamoProps = getDynamoProps(codegen);
		const apiName = `${name}-graphql-api`;
		const api = new GraphQLApi(this, apiName, {
			name: apiName,
			schemaDefinition: codegen.schema,
		});
		this.dynamoStacks = map(
			dynamo.createDynamoTableDataSource(this, props, api),
			dynamoProps,
		);
	}
}
