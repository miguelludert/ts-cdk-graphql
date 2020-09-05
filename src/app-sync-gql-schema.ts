import { Construct } from "@aws-cdk/core";
import { GraphQLTransform } from "graphql-transformer-core";
import { readFileSync } from "fs";
import { I_AppSyncGqlSchemaProps, I_DatasourceProvider } from "./interfaces";
import { NO_SCHEMA_ERROR_MESSAGE } from "./constants";
import { datasourceProviders } from "./datasource-providers";
import deepmerge from "deepmerge";

export class AppSyncGqlSchema extends Construct {
	constructor(scope: Construct, name: string, props: I_AppSyncGqlSchemaProps) {
		super(scope, name);
		const providers = getProviders(props);
		const cfSchema = getCfSchema(props, providers);
		const datasources = createResources(this, props, providers, cfSchema);
		Object.assign(this, datasources);
	}
}

export const getProviders = (
	props: I_AppSyncGqlSchemaProps,
): I_DatasourceProvider[] => [
	...datasourceProviders,
	...(props.datasourceProviders || []),
];

export const getCfSchema = (
	props: I_AppSyncGqlSchemaProps,
	providers: I_DatasourceProvider[],
) => {
	const schemaText = getSchemaText(props);
	const transformers = providers.flatMap((provider) =>
		provider.getTransformer(),
	);
	const gqlTransform = new GraphQLTransform({
		transformers,
	});
	const cfSchema = gqlTransform.transform(schemaText);
	return cfSchema;
};

export const getSchemaText = (props: I_AppSyncGqlSchemaProps): string => {
	if (!props.schemaFile && !props.schemaText) {
		throw new Error(NO_SCHEMA_ERROR_MESSAGE);
	}
	const { schemaText, schemaFile } = props;
	if (schemaFile) {
		return readFileSync(schemaFile, "utf8");
	} else {
		return <string>schemaText;
	}
};

export const createResources = (
	scope: Construct,
	props: I_AppSyncGqlSchemaProps,
	providers: I_DatasourceProvider[],
	cfSchema: any,
) => {
	return providers.reduce(
		(acc, provider) =>
			deepmerge(acc, provider.createResources(scope, props, cfSchema)),
		{},
	);
};
