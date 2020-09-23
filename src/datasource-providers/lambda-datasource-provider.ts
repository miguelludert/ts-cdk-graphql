import { Construct } from "@aws-cdk/core";
import { FunctionTransformer } from "graphql-function-transformer";
import { ITransformer } from "graphql-transformer-core";
import {
	I_DatasourceProvider,
	I_ConstructMap,
	I_AppSyncGqlSchemaProps,
} from "../interfaces";
import { createResources } from "./lambda-create-resources";
import { cast } from "../typescript-utils";

// data sources must be in typescript
export class LambdaDatasourceProvider implements I_DatasourceProvider {
	getTransformer(): ITransformer[] {
		return [new FunctionTransformer() as ITransformer];
	}
	createResources(
		scope: Construct,
		props: I_AppSyncGqlSchemaProps,
		cfSchema: any,
	): I_ConstructMap {
		return cast<I_ConstructMap>(createResources(scope, props, cfSchema));
	}
}
//
// export interface I_DatasourceProvider {
// 	getTransformer: () => ITransformer[];
// 	createResources: (
// 		scope: Construct,
// 		props: I_AppSyncGqlSchemaProps,
// 		cfSchema: any,
// 	) => I_DatasourceResult;
// }
