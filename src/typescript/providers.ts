import { Construct } from "@aws-cdk/core";
import { DynamoDBModelTransformer } from "graphql-dynamodb-transformer";
import { ModelConnectionTransformer } from "graphql-connection-transformer";
import { FunctionTransformer } from "graphql-function-transformer";
import {
	AppSyncAuthConfiguration,
	AppSyncAuthConfigurationEntry,
	ModelAuthTransformer,
	ModelAuthTransformerConfig,
	AppSyncAuthMode,
} from "graphql-auth-transformer";
import { KeyTransformer } from "graphql-key-transformer";
import { ITransformer } from "graphql-transformer-core";
import {
	GraphqlApi,
	AuthorizationMode,
	AuthorizationType,
} from "@aws-cdk/aws-appsync";

import {
	I_DatasourceProvider,
	I_ConstructMap,
	I_AppSyncGqlSchemaProps,
} from "./interfaces";
import { createDynamoDataSource } from "../providers/dynamo";
import { createLambdaDataSource } from "../providers/lambda";
import { cast, info } from "./utils";

// data sources must be in typescript
export class DynamoDatasourceProvider implements I_DatasourceProvider {
	getTransformer(props: I_AppSyncGqlSchemaProps): ITransformer[] {
		return [
			// the order of transformers matters
			new ModelConnectionTransformer(),
			new DynamoDBModelTransformer(),
			new KeyTransformer(),
		];
	}
	createResources(
		scope: Construct,
		props: I_AppSyncGqlSchemaProps,
		api: GraphqlApi,
		cfSchema: any,
	): I_ConstructMap {
		info("dynamo provider");
		return cast<I_ConstructMap>(
			createDynamoDataSource(scope, props, api, cfSchema),
		);
	}
}

// data sources must be in typescript
export class LambdaDatasourceProvider implements I_DatasourceProvider {
	getTransformer(props: I_AppSyncGqlSchemaProps): ITransformer[] {
		return [new FunctionTransformer()];
	}
	createResources(
		scope: Construct,
		props: I_AppSyncGqlSchemaProps,
		api: GraphqlApi,
		cfSchema: any,
	): I_ConstructMap {
		info("lambda provider");
		return cast<I_ConstructMap>(
			createLambdaDataSource(scope, props, api, cfSchema),
		);
	}
}

// data sources must be in typescript
export class AuthDatasourceProvider implements I_DatasourceProvider {
	getTransformer(props: I_AppSyncGqlSchemaProps): ITransformer[] {
		if (props.authorizationConfig) {
			const cdkAuthToTransformerEntry = (
				mode?: AuthorizationMode,
			): AppSyncAuthConfigurationEntry | void => {
				if (mode) {
					const authTypeFactory = {
						[AuthorizationType.API_KEY]: () => ({
							authenticationType: "API_KEY",
							apiKeyConfig: {
								description: mode.apiKeyConfig?.description,
								apiKeyExpirationDays: mode.apiKeyConfig?.expires,
							},
						}),
						[AuthorizationType.IAM]: () => ({
							authenticationType: "AWS_IAM",
						}),
						[AuthorizationType.OIDC]: () => ({
							authenticationType: "OPENID_CONNECT",
							openIDConnectConfig: {
								name: mode.openIdConnectConfig?.oidcProvider,
								//issuerUrl: mode.openIdConnectConfig?.oidcProvider;
								clientId: mode.openIdConnectConfig?.clientId,
								iatTTL: mode.openIdConnectConfig?.tokenExpiryFromIssue,
								authTTL: mode.openIdConnectConfig?.tokenExpiryFromAuth,
							},
						}),
						[AuthorizationType.USER_POOL]: () => ({
							authenticationType: "AMAZON_COGNITO_USER_POOLS",
							userPoolConfig: {
								userPoolId: mode.userPoolConfig?.userPool.userPoolId,
							},
						}),
					};
					const result = authTypeFactory[
						mode.authorizationType
					]() as AppSyncAuthConfigurationEntry;
					return result;
				}
			};

			const [
				defaultAuthorization,
				...additionalAuthorizationModes
			] = props.authorizationConfig;

			const transformerProps = {
				authConfig: {
					defaultAuthentication: cdkAuthToTransformerEntry(
						defaultAuthorization,
					),
					additionalAuthenticationProviders: additionalAuthorizationModes.map(
						cdkAuthToTransformerEntry,
					),
				},
			} as ModelAuthTransformerConfig;

			return [new ModelAuthTransformer(transformerProps)];
		}
		return [new ModelAuthTransformer()];
	}
	createResources(
		scope: Construct,
		props: I_AppSyncGqlSchemaProps,
		api: GraphqlApi,
		cfSchema: any,
	): void {
		info("auth provider");
		// throw new Error("Auth reached");
		// return cast<I_ConstructMap>(
		// 	createLambdaDataSource(scope, props, api, cfSchema),
		// );
	}
}
