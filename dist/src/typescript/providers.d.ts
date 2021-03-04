import { Construct } from "@aws-cdk/core";
import { ITransformer } from "graphql-transformer-core";
import { GraphqlApi } from "@aws-cdk/aws-appsync";
import { I_DatasourceProvider, I_ConstructMap, I_AppSyncGqlSchemaProps } from "./interfaces";
export declare class DynamoDatasourceProvider implements I_DatasourceProvider {
    getTransformer(props: I_AppSyncGqlSchemaProps): ITransformer[];
    createResources(scope: Construct, props: I_AppSyncGqlSchemaProps, api: GraphqlApi, cfSchema: any): I_ConstructMap;
}
export declare class LambdaDatasourceProvider implements I_DatasourceProvider {
    getTransformer(props: I_AppSyncGqlSchemaProps): ITransformer[];
    createResources(scope: Construct, props: I_AppSyncGqlSchemaProps, api: GraphqlApi, cfSchema: any): I_ConstructMap;
}
export declare class AuthDatasourceProvider implements I_DatasourceProvider {
    getTransformer(props: I_AppSyncGqlSchemaProps): ITransformer[];
    createResources(scope: Construct, props: I_AppSyncGqlSchemaProps, api: GraphqlApi, cfSchema: any): void;
}
