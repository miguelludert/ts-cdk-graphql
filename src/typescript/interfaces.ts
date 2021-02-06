import { Construct } from "@aws-cdk/core";
import { GraphqlApi } from "@aws-cdk/aws-appsync";
import { ITransformer } from "graphql-transformer-core";

export interface I_ConstructSetupProps {
	[key: string]: {
		onProps?: (scope: Construct, props: any, context: any) => any;
		onConstruct?: (scope: Construct, props: any, context: any) => any;
	};
}

export interface I_ResolverSetupProps {
	[key: string]: {
		pipeline?: [string];
		requestTemplate?: [string];
		responseTemplate?: [string];
	};
}

export interface I_DatasourceProvider {
	getTransformer: () => ITransformer[];
	createResources: (
		scope: Construct,
		props: I_AppSyncGqlSchemaProps,
		api: GraphqlApi,
		cfSchema: any,
	) => I_ConstructMap;
}

export interface I_ConstructMap {
	[key: string]: any;
}

export interface I_AppSyncGqlSchemaProps {
	baseName? : string;
	
	environment?: {
		[key: string]: string;
	};
	context?: any;
	lambdaFunctionCodeDir?: string;
	lambdaFunctionName?: string;
	lambdaHandlerName?: string;
	lambdaRuntime?: string;
	namingConvention?: (resourceName: string, typeName: string) => string;
	schemaFile?: string;
	schemaText?: string;
	defaultsDirectory?: string;
	overridesDirectory?: string;
	defaults?: I_ConstructSetupProps;
	overrides?: I_ConstructSetupProps;
	datasourceProviders?: I_DatasourceProvider[];
	outputGraphqlSchemaFilePath? : string;
	outputCfnSchemaFilePath? : string;
}

export interface I_CreateConstructContext {
	resourceName : string;
	props : I_AppSyncGqlSchemaProps
	[key: string] : any;
}
