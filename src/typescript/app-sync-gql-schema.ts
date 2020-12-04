import { Construct } from "@aws-cdk/core";
import { NestedStack } from "@aws-cdk/aws-cloudformation";
import { GraphqlApi, GraphqlApiProps, Schema } from "@aws-cdk/aws-appsync";
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

export class AppSyncGqlSchema extends NestedStack {
	constructor(scope : Construct, name: string, props: I_AppSyncGqlSchemaProps) {
		super(scope, name);


		const providers = self.getProviders(props);
		const cfSchema = self.getCfSchema(props, providers);
		const api = self.createApi(scope, "asdfasd");
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
	api: GraphqlApi,
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
): GraphqlApi => {
	const props = {
		name : 'graphql-api',
		//schema ne
	};
	const result = createConstruct<GraphqlApi, GraphqlApiProps>(scope, props, GraphqlApi, 'graphql-api');
	return result;
};
