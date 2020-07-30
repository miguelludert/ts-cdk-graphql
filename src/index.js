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

export const getCodeGenSchema = (options, schemaText) => {
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
	const codeGenSchema = transformer.transform(schemaText);
	return codeGenSchema;
};

export const readSchema = path => readFileSync(path, "utf8");

export class AppsyncGQLSchemaStack extends Stack {
	constructor(scope, name, props) {
		// read schema
		super(scope, name, props);
		const schema = props.schemaText || readSchema(props.schemaPath);
		const codegen = getCodeGenSchema(props, schema);
		const dynamoProps = dynamo.getDynamoDataSources(props, codegen);
		const apiName = `${name}-graphql-api`;
		const api = new GraphQLApi(this, apiName, {
			name: apiName,
			schemaDefinition: codegen.schema,
		});
		this.dynamoStacks = map(
			dynamo.createDynamoTableDataSource(this, props, api),
			dynamoProps,
		);
		this.functionStacks = [];
		this.httpStacks = [];
	}
}
