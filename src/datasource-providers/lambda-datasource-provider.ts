import { Construct } from "@aws-cdk/core";
import { FunctionTransformer } from "graphql-function-transformer";
import { ITransformer } from "graphql-transformer-core";
import {
	I_DatasourceProvider,
	I_ConstructMap,
	I_AppSyncGqlSchemaProps,
} from "../interfaces";

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
		return {} as I_ConstructMap;
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
