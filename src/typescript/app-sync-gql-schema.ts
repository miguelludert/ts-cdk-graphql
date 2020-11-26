import { Construct } from "@aws-cdk/core";
import { GraphQLApi, GraphQLApiProps } from "@aws-cdk/aws-appsync";
import { GraphQLTransform } from "graphql-transformer-core";
import { I_AppSyncGqlSchemaProps, I_DatasourceProvider } from "./interfaces";
import { NO_SCHEMA_ERROR_MESSAGE } from "../constants";
import { DynamoDatasourceProvider } from "./providers";
import deepmerge from "deepmerge";
import { cast, getProps, readFileSync, createConstruct } from "./utils";
import * as self from './app-sync-gql-schema';

export const defaultDatasourceProviders : I_DatasourceProvider[] = [
	new DynamoDatasourceProvider(),
	//cast<I_DatasourceProvider>(LambdaDatasourceProvider),
];

export class AppSyncGqlSchema extends Construct {
	constructor(scope: Construct, name: string, props: I_AppSyncGqlSchemaProps) {
		super(scope, name);
		// const providers = getProviders(props);
		// const cfSchema = getCfSchema(props, providers);
		// const api = createApi(this, props, cfSchema);
		// const datasources = createResources(this, props, api, providers, cfSchema);
		// Object.assign(this, datasources);
	}
}

export const getProviders = (props: I_AppSyncGqlSchemaProps): I_DatasourceProvider[] => {
	return [
		...defaultDatasourceProviders,
		...(props.datasourceProviders || []),
	];
}

export const getSchemaText = (props: I_AppSyncGqlSchemaProps): string => {
	if (!props.schemaFile && !props.schemaText) {
		throw new Error(NO_SCHEMA_ERROR_MESSAGE);
	}
	const { schemaText, schemaFile } = props;
	if (schemaFile) {
		return cast<string>(readFileSync(schemaFile, "utf8"));
	} else {
		return <string>schemaText;
	}
};

export const createResources = (
	scope: Construct,
	props: I_AppSyncGqlSchemaProps,
	api: GraphQLApi,
	providers: I_DatasourceProvider[],
	cfSchema: object,
) => {
	return providers.reduce(
		(acc, provider) =>
			deepmerge(acc, provider.createResources(scope, props, api, cfSchema)),
		{},
	);
};

export const getCfSchema = (
	props: I_AppSyncGqlSchemaProps,
	providers: I_DatasourceProvider[],
): object => {
	const schemaText = self.getSchemaText(props);
	const transformers = providers.flatMap((provider) =>
		provider.getTransformer(),
	);
	const gqlTransform = new GraphQLTransform({
		transformers,
	});
	const cfSchema = gqlTransform.transform(schemaText);
	return cfSchema;
};

export const createApi = (
	scope: Construct,
	schema: string,
): GraphQLApi => {
	const props = {
		name : 'graphql-api',
		schema
	};
	const result = createConstruct<GraphQLApi, GraphQLApiProps>(scope, props, GraphQLApi, 'graphql-api')
	return result;
};
