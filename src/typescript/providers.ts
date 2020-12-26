import { Construct } from "@aws-cdk/core";
import { DynamoDBModelTransformer } from "graphql-dynamodb-transformer";
import { ModelConnectionTransformer } from "graphql-connection-transformer";
import { ModelAuthTransformer } from "graphql-auth-transformer";
import { KeyTransformer } from "graphql-key-transformer";
import { ITransformer } from "graphql-transformer-core";
import { GraphqlApi } from "@aws-cdk/aws-appsync";

import {
	I_DatasourceProvider,
	I_ConstructMap,
	I_AppSyncGqlSchemaProps,
} from "./interfaces";
import { createDynamoResources } from "../providers/dynamo";
import { cast } from "./utils";
import { dump } from "../providers/utils";

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
		return cast<I_ConstructMap>(createDynamoResources(scope, api, cfSchema));
	}
}

