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
import * as lambda from "./lambda";
import { Stack } from "@aws-cdk/core";
import { GraphQLApi } from "@aws-cdk/aws-appsync";
import { isRequired } from "./utils";

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
		const apiName = `${name}-graphql-api`;
		const api = new GraphQLApi(this, apiName, {
			name: apiName,
			schemaDefinition: codegen.schema,
		});
		this.dynamoStacks = getDynamoStack(this, props, codegen, api);
		this.functionStacks = getFunctionStack(this, props, codegen, api);
		this.httpStacks = [];
	}
}

export const getDynamoStack = (scope, props, codegen, api) => {
	const propSet = dynamo.getDynamoDataSources(props, codegen);
	return map(dynamo.createDynamoTableDataSource(scope, props, api), propSet);
};

export const getFunctionStack = (scope, props, codegen, api) => {
	const propSet = lambda.getLambdaDataSources(props, codegen);
	return map(lambda.createLambdaStack(scope, props, api), propSet);
};
