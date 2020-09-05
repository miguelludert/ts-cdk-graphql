import { Construct } from "@aws-cdk/core";
import { ITransformer } from "graphql-transformer-core";

export interface I_ConstructSetupFunctionsProps {
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
		cfSchema: any,
	) => I_ConstructMap;
}

export interface I_ConstructMap {
	[key: string]: Construct[];
}

export interface I_AppSyncGqlSchemaProps {
	environment?: {
		[key: string]: string;
	};
	context?: any;
	prefix?: string;
	schemaFile?: string;
	schemaText?: string;
	defaultsDirectory?: string;
	overridesDirectory?: string;
	defaults?: I_ConstructSetupFunctionsProps;
	overrides?: I_ConstructSetupFunctionsProps;
	datasourceProviders?: I_DatasourceProvider[];
}
