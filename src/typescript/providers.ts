import { Construct } from "@aws-cdk/core";
import { DynamoDBModelTransformer } from "graphql-dynamodb-transformer";
import { ModelConnectionTransformer } from "graphql-connection-transformer";
import { FunctionTransformer } from "graphql-function-transformer";
import { ModelAuthTransformer } from "graphql-auth-transformer";
import { KeyTransformer } from "graphql-key-transformer";
import { ITransformer } from "graphql-transformer-core";
import { GraphqlApi } from "@aws-cdk/aws-appsync";

import {
	I_DatasourceProvider,
	I_ConstructMap,
	I_AppSyncGqlSchemaProps,
} from "./interfaces";
import { createDynamoDataSource } from "../providers/dynamo";
import { createLambdaDataSource } from "../providers/lambda";
import { cast, info } from "./utils";

// data sources must be in typescript
export class DynamoDatasourceProvider implements I_DatasourceProvider {
	getTransformer(): ITransformer[] {
		return [
			// the order of transformers matters
			new ModelConnectionTransformer(),
			new DynamoDBModelTransformer(),
			new KeyTransformer(),
		];
	}
	createResources(
		scope: Construct,
		props: I_AppSyncGqlSchemaProps,
		api: GraphqlApi,
		cfSchema: any,
	): I_ConstructMap {
		info("dynamo provider");
		return cast<I_ConstructMap>(createDynamoDataSource(scope, props, api, cfSchema));
	}
}

// data sources must be in typescript
export class LambdaDatasourceProvider implements I_DatasourceProvider {
	getTransformer(): ITransformer[] {
		return [
			new FunctionTransformer()
		]
	}
	createResources(
		scope: Construct,
		props: I_AppSyncGqlSchemaProps,
		api: GraphqlApi,
		cfSchema: any,
	): I_ConstructMap {
		info("lambda provider");
		return cast<I_ConstructMap>(createLambdaDataSource(scope, props, api, cfSchema));
	}
}

// data sources must be in typescript
export class AuthDatasourceProvider implements I_DatasourceProvider {
	getTransformer(): ITransformer[] {
		return [
			new ModelAuthTransformer()
		]
	}
	createResources(
		scope: Construct,
		props: I_AppSyncGqlSchemaProps,
		api: GraphqlApi,
		cfSchema: any,
	): I_ConstructMap {
		// info("lambda provider");
		throw new Error("asdfasdf")
		return cast<I_ConstructMap>(createLambdaDataSource(scope, props, api, cfSchema));
	}
}

