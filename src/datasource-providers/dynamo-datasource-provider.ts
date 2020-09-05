import { Construct } from "@aws-cdk/core";
import { DynamoDBModelTransformer } from "graphql-dynamodb-transformer";
import { ModelConnectionTransformer } from "graphql-connection-transformer";
import { ModelAuthTransformer } from "graphql-auth-transformer";
import { KeyTransformer } from "graphql-key-transformer";
import { ITransformer } from "graphql-transformer-core";
import {
	I_DatasourceProvider,
	I_ConstructMap,
	I_AppSyncGqlSchemaProps,
} from "../interfaces";
import { createResources } from "./dynamo-create-resources";
import { cast } from "../typescript-utils";

// data sources must be in typescript
export class DynamoDatasourceProvider implements I_DatasourceProvider {
	getTransformer(): ITransformer[] {
		return [
			new ModelAuthTransformer(),
			new KeyTransformer(),
			new ModelConnectionTransformer(),
			new DynamoDBModelTransformer(),
		];
	}
	createResources(
		scope: Construct,
		props: I_AppSyncGqlSchemaProps,
		cfSchema: any,
	): I_ConstructMap {
		return cast<I_ConstructMap>(createResources(scope, props, cfSchema));
	}
}
