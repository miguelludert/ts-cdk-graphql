import { Construct, NestedStack } from "@aws-cdk/core";
import { GraphqlApi } from "@aws-cdk/aws-appsync";
import { GraphQLTransform } from "graphql-transformer-core";
import { I_AppSyncGqlSchemaProps, I_DatasourceProvider } from "./interfaces";
import { NO_SCHEMA_ERROR_MESSAGE } from "../constants";
import {
	DynamoDatasourceProvider,
	LambdaDatasourceProvider,
	//AuthDatasourceProvider
} from "./providers";
import { createResolversAndFunctionsFromSchema } from "../providers/functions";
import deepmerge from "deepmerge";
import { cast, readFileSync, createConstruct, info } from "./utils";
import { writeFileSync } from "fs";
import * as self from "./app-sync-gql-schema";
import { helpInformation } from "commander";
import { Table } from "@aws-cdk/aws-dynamodb";
import { Function } from "@aws-cdk/aws-lambda";
import { Lambda } from "aws-sdk";



export class AppSyncGqlSchema extends NestedStack {
	constructor(scope: Construct, name: string, props: I_AppSyncGqlSchemaProps) {
		super(scope, name);

		if (!props.namingConvention) {
			props.namingConvention = (name) => name;
		}

		const baseName = props.baseName || name;
		info("getProviders");
		const providers = self.getProviders(props);
		info("getSchemaText");
		const schemaText = self.getSchemaText(props);
		info("getCfSchema");
		const cfSchema = self.getCfSchema(schemaText, providers);

		// output as soon as schemas are available for debugging
		if (props.outputGraphqlSchemaFilePath) {
			writeFileSync(props.outputGraphqlSchemaFilePath, cfSchema.schema, "utf8");
		}

		if (props.outputCfnSchemaFilePath) {
			writeFileSync(
				props.outputCfnSchemaFilePath,
				JSON.stringify(cfSchema, null, 2),
				"utf8",
			);
		}

		info("createApi");
		const api = self.createApi(scope, props, cfSchema.schema);
		info("createResources");
		const datasources = createResources(this, props, api, providers, cfSchema);
		// Object.assign(this, datasources);

		//set graphqlApiUrl
		//set
		//throw new Error("STOP");
	}
}

export const getProviders = (
	props: I_AppSyncGqlSchemaProps,
): I_DatasourceProvider[] => {
	const defaultDatasourceProviders: I_DatasourceProvider[] = [
		new DynamoDatasourceProvider(),
		new LambdaDatasourceProvider(),
		//new AuthDatasourceProvider(),
	];
	const datasourceProviders =
		props && props.datasourceProviders ? props.datasourceProviders : [];
	return [...defaultDatasourceProviders, ...datasourceProviders];
};

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
	const resources = providers.flatMap((provider) =>
		provider.createResources(scope, props, api, cfSchema),
	);
	const tables = resources.filter(f => f.table).map(f => f.table);
	const lambdas = resources.filter(f => f.lambda).map(f => f.lambda);

	lambdas.forEach((lambda : Function) => { 
		tables.forEach((table : Table) => {
			table.grantFullAccess(lambda);
		})
	})

	const { funcs, resolvers } = <any>(
		createResolversAndFunctionsFromSchema(scope, props, api, cfSchema, resources)
	);
};

export const getCfSchema = (
	schemaText: string,
	providers: I_DatasourceProvider[],
): any => {
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
	props: I_AppSyncGqlSchemaProps,
	schemaText: string,
): GraphqlApi => {
	const result = createConstruct(scope, props, GraphqlApi, "gql-api");
	// this is a hack for the CFN to receive the schema text.
	result.schemaResource.definition = schemaText;
	return result;
};
