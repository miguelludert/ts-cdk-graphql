import { Construct, NestedStack } from "@aws-cdk/core";
import { GraphqlApi } from "@aws-cdk/aws-appsync";
import { I_AppSyncGqlSchemaProps, I_DatasourceProvider } from "./interfaces";
export declare class AppSyncGqlSchema extends NestedStack {
    api: GraphqlApi;
    constructor(scope: Construct, name: string, props: I_AppSyncGqlSchemaProps);
}
export declare const getProviders: (props: I_AppSyncGqlSchemaProps) => I_DatasourceProvider[];
export declare const getSchemaText: (props: I_AppSyncGqlSchemaProps) => string;
export declare const createResources: (scope: Construct, props: I_AppSyncGqlSchemaProps, api: GraphqlApi, providers: I_DatasourceProvider[], cfSchema: object) => void;
export declare const getCfSchema: (schemaText: string, providers: I_DatasourceProvider[], props: I_AppSyncGqlSchemaProps) => any;
export declare const createApi: (scope: Construct, props: I_AppSyncGqlSchemaProps, schemaText: string) => GraphqlApi;
