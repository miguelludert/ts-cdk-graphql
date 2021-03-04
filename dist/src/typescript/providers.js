"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthDatasourceProvider = exports.LambdaDatasourceProvider = exports.DynamoDatasourceProvider = void 0;
const graphql_dynamodb_transformer_1 = require("graphql-dynamodb-transformer");
const graphql_connection_transformer_1 = require("graphql-connection-transformer");
const graphql_function_transformer_1 = require("graphql-function-transformer");
const graphql_auth_transformer_1 = require("graphql-auth-transformer");
const graphql_key_transformer_1 = require("graphql-key-transformer");
const aws_appsync_1 = require("@aws-cdk/aws-appsync");
const dynamo_1 = require("../providers/dynamo");
const lambda_1 = require("../providers/lambda");
const utils_1 = require("./utils");
// data sources must be in typescript
class DynamoDatasourceProvider {
    getTransformer(props) {
        return [
            // the order of transformers matters
            new graphql_connection_transformer_1.ModelConnectionTransformer(),
            new graphql_dynamodb_transformer_1.DynamoDBModelTransformer(),
            new graphql_key_transformer_1.KeyTransformer(),
        ];
    }
    createResources(scope, props, api, cfSchema) {
        utils_1.info("dynamo provider");
        return utils_1.cast(dynamo_1.createDynamoDataSource(scope, props, api, cfSchema));
    }
}
exports.DynamoDatasourceProvider = DynamoDatasourceProvider;
// data sources must be in typescript
class LambdaDatasourceProvider {
    getTransformer(props) {
        return [new graphql_function_transformer_1.FunctionTransformer()];
    }
    createResources(scope, props, api, cfSchema) {
        utils_1.info("lambda provider");
        return utils_1.cast(lambda_1.createLambdaDataSource(scope, props, api, cfSchema));
    }
}
exports.LambdaDatasourceProvider = LambdaDatasourceProvider;
// data sources must be in typescript
class AuthDatasourceProvider {
    getTransformer(props) {
        if (props.authorizationConfig) {
            const cdkAuthToTransformerEntry = (mode) => {
                if (mode) {
                    const authTypeFactory = {
                        [aws_appsync_1.AuthorizationType.API_KEY]: () => {
                            var _a, _b;
                            return ({
                                authenticationType: "API_KEY",
                                apiKeyConfig: {
                                    description: (_a = mode.apiKeyConfig) === null || _a === void 0 ? void 0 : _a.description,
                                    apiKeyExpirationDays: (_b = mode.apiKeyConfig) === null || _b === void 0 ? void 0 : _b.expires,
                                },
                            });
                        },
                        [aws_appsync_1.AuthorizationType.IAM]: () => ({
                            authenticationType: "AWS_IAM",
                        }),
                        [aws_appsync_1.AuthorizationType.OIDC]: () => {
                            var _a, _b, _c, _d;
                            return ({
                                authenticationType: "OPENID_CONNECT",
                                openIDConnectConfig: {
                                    name: (_a = mode.openIdConnectConfig) === null || _a === void 0 ? void 0 : _a.oidcProvider,
                                    //issuerUrl: mode.openIdConnectConfig?.oidcProvider;
                                    clientId: (_b = mode.openIdConnectConfig) === null || _b === void 0 ? void 0 : _b.clientId,
                                    iatTTL: (_c = mode.openIdConnectConfig) === null || _c === void 0 ? void 0 : _c.tokenExpiryFromIssue,
                                    authTTL: (_d = mode.openIdConnectConfig) === null || _d === void 0 ? void 0 : _d.tokenExpiryFromAuth,
                                },
                            });
                        },
                        [aws_appsync_1.AuthorizationType.USER_POOL]: () => {
                            var _a;
                            return ({
                                authenticationType: "AMAZON_COGNITO_USER_POOLS",
                                userPoolConfig: {
                                    userPoolId: (_a = mode.userPoolConfig) === null || _a === void 0 ? void 0 : _a.userPool.userPoolId,
                                },
                            });
                        },
                    };
                    const result = authTypeFactory[mode.authorizationType]();
                    return result;
                }
            };
            const [defaultAuthorization, ...additionalAuthorizationModes] = props.authorizationConfig;
            const transformerProps = {
                authConfig: {
                    defaultAuthentication: cdkAuthToTransformerEntry(defaultAuthorization),
                    additionalAuthenticationProviders: additionalAuthorizationModes.map(cdkAuthToTransformerEntry),
                },
            };
            return [new graphql_auth_transformer_1.ModelAuthTransformer(transformerProps)];
        }
        return [new graphql_auth_transformer_1.ModelAuthTransformer()];
    }
    createResources(scope, props, api, cfSchema) {
        utils_1.info("auth provider");
        // throw new Error("Auth reached");
        // return cast<I_ConstructMap>(
        // 	createLambdaDataSource(scope, props, api, cfSchema),
        // );
    }
}
exports.AuthDatasourceProvider = AuthDatasourceProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3R5cGVzY3JpcHQvcHJvdmlkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtFQUF3RTtBQUN4RSxtRkFBNEU7QUFDNUUsK0VBQW1FO0FBQ25FLHVFQU1rQztBQUNsQyxxRUFBeUQ7QUFFekQsc0RBSThCO0FBTzlCLGdEQUE2RDtBQUM3RCxnREFBNkQ7QUFDN0QsbUNBQXFDO0FBRXJDLHFDQUFxQztBQUNyQyxNQUFhLHdCQUF3QjtJQUNwQyxjQUFjLENBQUMsS0FBOEI7UUFDNUMsT0FBTztZQUNOLG9DQUFvQztZQUNwQyxJQUFJLDJEQUEwQixFQUFFO1lBQ2hDLElBQUksdURBQXdCLEVBQUU7WUFDOUIsSUFBSSx3Q0FBYyxFQUFFO1NBQ3BCLENBQUM7SUFDSCxDQUFDO0lBQ0QsZUFBZSxDQUNkLEtBQWdCLEVBQ2hCLEtBQThCLEVBQzlCLEdBQWUsRUFDZixRQUFhO1FBRWIsWUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDeEIsT0FBTyxZQUFJLENBQ1YsK0JBQXNCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQ25ELENBQUM7SUFDSCxDQUFDO0NBQ0Q7QUFwQkQsNERBb0JDO0FBRUQscUNBQXFDO0FBQ3JDLE1BQWEsd0JBQXdCO0lBQ3BDLGNBQWMsQ0FBQyxLQUE4QjtRQUM1QyxPQUFPLENBQUMsSUFBSSxrREFBbUIsRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNELGVBQWUsQ0FDZCxLQUFnQixFQUNoQixLQUE4QixFQUM5QixHQUFlLEVBQ2YsUUFBYTtRQUViLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sWUFBSSxDQUNWLCtCQUFzQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUNuRCxDQUFDO0lBQ0gsQ0FBQztDQUNEO0FBZkQsNERBZUM7QUFFRCxxQ0FBcUM7QUFDckMsTUFBYSxzQkFBc0I7SUFDbEMsY0FBYyxDQUFDLEtBQThCO1FBQzVDLElBQUksS0FBSyxDQUFDLG1CQUFtQixFQUFFO1lBQzlCLE1BQU0seUJBQXlCLEdBQUcsQ0FDakMsSUFBd0IsRUFDZSxFQUFFO2dCQUN6QyxJQUFJLElBQUksRUFBRTtvQkFDVCxNQUFNLGVBQWUsR0FBRzt3QkFDdkIsQ0FBQywrQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUU7OzRCQUFDLE9BQUEsQ0FBQztnQ0FDbkMsa0JBQWtCLEVBQUUsU0FBUztnQ0FDN0IsWUFBWSxFQUFFO29DQUNiLFdBQVcsUUFBRSxJQUFJLENBQUMsWUFBWSwwQ0FBRSxXQUFXO29DQUMzQyxvQkFBb0IsUUFBRSxJQUFJLENBQUMsWUFBWSwwQ0FBRSxPQUFPO2lDQUNoRDs2QkFDRCxDQUFDLENBQUE7eUJBQUE7d0JBQ0YsQ0FBQywrQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDOzRCQUMvQixrQkFBa0IsRUFBRSxTQUFTO3lCQUM3QixDQUFDO3dCQUNGLENBQUMsK0JBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFOzs0QkFBQyxPQUFBLENBQUM7Z0NBQ2hDLGtCQUFrQixFQUFFLGdCQUFnQjtnQ0FDcEMsbUJBQW1CLEVBQUU7b0NBQ3BCLElBQUksUUFBRSxJQUFJLENBQUMsbUJBQW1CLDBDQUFFLFlBQVk7b0NBQzVDLG9EQUFvRDtvQ0FDcEQsUUFBUSxRQUFFLElBQUksQ0FBQyxtQkFBbUIsMENBQUUsUUFBUTtvQ0FDNUMsTUFBTSxRQUFFLElBQUksQ0FBQyxtQkFBbUIsMENBQUUsb0JBQW9CO29DQUN0RCxPQUFPLFFBQUUsSUFBSSxDQUFDLG1CQUFtQiwwQ0FBRSxtQkFBbUI7aUNBQ3REOzZCQUNELENBQUMsQ0FBQTt5QkFBQTt3QkFDRixDQUFDLCtCQUFpQixDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRTs7NEJBQUMsT0FBQSxDQUFDO2dDQUNyQyxrQkFBa0IsRUFBRSwyQkFBMkI7Z0NBQy9DLGNBQWMsRUFBRTtvQ0FDZixVQUFVLFFBQUUsSUFBSSxDQUFDLGNBQWMsMENBQUUsUUFBUSxDQUFDLFVBQVU7aUNBQ3BEOzZCQUNELENBQUMsQ0FBQTt5QkFBQTtxQkFDRixDQUFDO29CQUNGLE1BQU0sTUFBTSxHQUFHLGVBQWUsQ0FDN0IsSUFBSSxDQUFDLGlCQUFpQixDQUN0QixFQUFtQyxDQUFDO29CQUNyQyxPQUFPLE1BQU0sQ0FBQztpQkFDZDtZQUNGLENBQUMsQ0FBQztZQUVGLE1BQU0sQ0FDTCxvQkFBb0IsRUFDcEIsR0FBRyw0QkFBNEIsQ0FDL0IsR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUM7WUFFOUIsTUFBTSxnQkFBZ0IsR0FBRztnQkFDeEIsVUFBVSxFQUFFO29CQUNYLHFCQUFxQixFQUFFLHlCQUF5QixDQUMvQyxvQkFBb0IsQ0FDcEI7b0JBQ0QsaUNBQWlDLEVBQUUsNEJBQTRCLENBQUMsR0FBRyxDQUNsRSx5QkFBeUIsQ0FDekI7aUJBQ0Q7YUFDNkIsQ0FBQztZQUVoQyxPQUFPLENBQUMsSUFBSSwrQ0FBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7U0FDcEQ7UUFDRCxPQUFPLENBQUMsSUFBSSwrQ0FBb0IsRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELGVBQWUsQ0FDZCxLQUFnQixFQUNoQixLQUE4QixFQUM5QixHQUFlLEVBQ2YsUUFBYTtRQUViLFlBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0QixtQ0FBbUM7UUFDbkMsK0JBQStCO1FBQy9CLHdEQUF3RDtRQUN4RCxLQUFLO0lBQ04sQ0FBQztDQUNEO0FBMUVELHdEQTBFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgeyBEeW5hbW9EQk1vZGVsVHJhbnNmb3JtZXIgfSBmcm9tIFwiZ3JhcGhxbC1keW5hbW9kYi10cmFuc2Zvcm1lclwiO1xuaW1wb3J0IHsgTW9kZWxDb25uZWN0aW9uVHJhbnNmb3JtZXIgfSBmcm9tIFwiZ3JhcGhxbC1jb25uZWN0aW9uLXRyYW5zZm9ybWVyXCI7XG5pbXBvcnQgeyBGdW5jdGlvblRyYW5zZm9ybWVyIH0gZnJvbSBcImdyYXBocWwtZnVuY3Rpb24tdHJhbnNmb3JtZXJcIjtcbmltcG9ydCB7XG5cdEFwcFN5bmNBdXRoQ29uZmlndXJhdGlvbixcblx0QXBwU3luY0F1dGhDb25maWd1cmF0aW9uRW50cnksXG5cdE1vZGVsQXV0aFRyYW5zZm9ybWVyLFxuXHRNb2RlbEF1dGhUcmFuc2Zvcm1lckNvbmZpZyxcblx0QXBwU3luY0F1dGhNb2RlLFxufSBmcm9tIFwiZ3JhcGhxbC1hdXRoLXRyYW5zZm9ybWVyXCI7XG5pbXBvcnQgeyBLZXlUcmFuc2Zvcm1lciB9IGZyb20gXCJncmFwaHFsLWtleS10cmFuc2Zvcm1lclwiO1xuaW1wb3J0IHsgSVRyYW5zZm9ybWVyIH0gZnJvbSBcImdyYXBocWwtdHJhbnNmb3JtZXItY29yZVwiO1xuaW1wb3J0IHtcblx0R3JhcGhxbEFwaSxcblx0QXV0aG9yaXphdGlvbk1vZGUsXG5cdEF1dGhvcml6YXRpb25UeXBlLFxufSBmcm9tIFwiQGF3cy1jZGsvYXdzLWFwcHN5bmNcIjtcblxuaW1wb3J0IHtcblx0SV9EYXRhc291cmNlUHJvdmlkZXIsXG5cdElfQ29uc3RydWN0TWFwLFxuXHRJX0FwcFN5bmNHcWxTY2hlbWFQcm9wcyxcbn0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgY3JlYXRlRHluYW1vRGF0YVNvdXJjZSB9IGZyb20gXCIuLi9wcm92aWRlcnMvZHluYW1vXCI7XG5pbXBvcnQgeyBjcmVhdGVMYW1iZGFEYXRhU291cmNlIH0gZnJvbSBcIi4uL3Byb3ZpZGVycy9sYW1iZGFcIjtcbmltcG9ydCB7IGNhc3QsIGluZm8gfSBmcm9tIFwiLi91dGlsc1wiO1xuXG4vLyBkYXRhIHNvdXJjZXMgbXVzdCBiZSBpbiB0eXBlc2NyaXB0XG5leHBvcnQgY2xhc3MgRHluYW1vRGF0YXNvdXJjZVByb3ZpZGVyIGltcGxlbWVudHMgSV9EYXRhc291cmNlUHJvdmlkZXIge1xuXHRnZXRUcmFuc2Zvcm1lcihwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMpOiBJVHJhbnNmb3JtZXJbXSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdC8vIHRoZSBvcmRlciBvZiB0cmFuc2Zvcm1lcnMgbWF0dGVyc1xuXHRcdFx0bmV3IE1vZGVsQ29ubmVjdGlvblRyYW5zZm9ybWVyKCksXG5cdFx0XHRuZXcgRHluYW1vREJNb2RlbFRyYW5zZm9ybWVyKCksXG5cdFx0XHRuZXcgS2V5VHJhbnNmb3JtZXIoKSxcblx0XHRdO1xuXHR9XG5cdGNyZWF0ZVJlc291cmNlcyhcblx0XHRzY29wZTogQ29uc3RydWN0LFxuXHRcdHByb3BzOiBJX0FwcFN5bmNHcWxTY2hlbWFQcm9wcyxcblx0XHRhcGk6IEdyYXBocWxBcGksXG5cdFx0Y2ZTY2hlbWE6IGFueSxcblx0KTogSV9Db25zdHJ1Y3RNYXAge1xuXHRcdGluZm8oXCJkeW5hbW8gcHJvdmlkZXJcIik7XG5cdFx0cmV0dXJuIGNhc3Q8SV9Db25zdHJ1Y3RNYXA+KFxuXHRcdFx0Y3JlYXRlRHluYW1vRGF0YVNvdXJjZShzY29wZSwgcHJvcHMsIGFwaSwgY2ZTY2hlbWEpLFxuXHRcdCk7XG5cdH1cbn1cblxuLy8gZGF0YSBzb3VyY2VzIG11c3QgYmUgaW4gdHlwZXNjcmlwdFxuZXhwb3J0IGNsYXNzIExhbWJkYURhdGFzb3VyY2VQcm92aWRlciBpbXBsZW1lbnRzIElfRGF0YXNvdXJjZVByb3ZpZGVyIHtcblx0Z2V0VHJhbnNmb3JtZXIocHJvcHM6IElfQXBwU3luY0dxbFNjaGVtYVByb3BzKTogSVRyYW5zZm9ybWVyW10ge1xuXHRcdHJldHVybiBbbmV3IEZ1bmN0aW9uVHJhbnNmb3JtZXIoKV07XG5cdH1cblx0Y3JlYXRlUmVzb3VyY2VzKFxuXHRcdHNjb3BlOiBDb25zdHJ1Y3QsXG5cdFx0cHJvcHM6IElfQXBwU3luY0dxbFNjaGVtYVByb3BzLFxuXHRcdGFwaTogR3JhcGhxbEFwaSxcblx0XHRjZlNjaGVtYTogYW55LFxuXHQpOiBJX0NvbnN0cnVjdE1hcCB7XG5cdFx0aW5mbyhcImxhbWJkYSBwcm92aWRlclwiKTtcblx0XHRyZXR1cm4gY2FzdDxJX0NvbnN0cnVjdE1hcD4oXG5cdFx0XHRjcmVhdGVMYW1iZGFEYXRhU291cmNlKHNjb3BlLCBwcm9wcywgYXBpLCBjZlNjaGVtYSksXG5cdFx0KTtcblx0fVxufVxuXG4vLyBkYXRhIHNvdXJjZXMgbXVzdCBiZSBpbiB0eXBlc2NyaXB0XG5leHBvcnQgY2xhc3MgQXV0aERhdGFzb3VyY2VQcm92aWRlciBpbXBsZW1lbnRzIElfRGF0YXNvdXJjZVByb3ZpZGVyIHtcblx0Z2V0VHJhbnNmb3JtZXIocHJvcHM6IElfQXBwU3luY0dxbFNjaGVtYVByb3BzKTogSVRyYW5zZm9ybWVyW10ge1xuXHRcdGlmIChwcm9wcy5hdXRob3JpemF0aW9uQ29uZmlnKSB7XG5cdFx0XHRjb25zdCBjZGtBdXRoVG9UcmFuc2Zvcm1lckVudHJ5ID0gKFxuXHRcdFx0XHRtb2RlPzogQXV0aG9yaXphdGlvbk1vZGUsXG5cdFx0XHQpOiBBcHBTeW5jQXV0aENvbmZpZ3VyYXRpb25FbnRyeSB8IHZvaWQgPT4ge1xuXHRcdFx0XHRpZiAobW9kZSkge1xuXHRcdFx0XHRcdGNvbnN0IGF1dGhUeXBlRmFjdG9yeSA9IHtcblx0XHRcdFx0XHRcdFtBdXRob3JpemF0aW9uVHlwZS5BUElfS0VZXTogKCkgPT4gKHtcblx0XHRcdFx0XHRcdFx0YXV0aGVudGljYXRpb25UeXBlOiBcIkFQSV9LRVlcIixcblx0XHRcdFx0XHRcdFx0YXBpS2V5Q29uZmlnOiB7XG5cdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG1vZGUuYXBpS2V5Q29uZmlnPy5kZXNjcmlwdGlvbixcblx0XHRcdFx0XHRcdFx0XHRhcGlLZXlFeHBpcmF0aW9uRGF5czogbW9kZS5hcGlLZXlDb25maWc/LmV4cGlyZXMsXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdFtBdXRob3JpemF0aW9uVHlwZS5JQU1dOiAoKSA9PiAoe1xuXHRcdFx0XHRcdFx0XHRhdXRoZW50aWNhdGlvblR5cGU6IFwiQVdTX0lBTVwiLFxuXHRcdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0XHRbQXV0aG9yaXphdGlvblR5cGUuT0lEQ106ICgpID0+ICh7XG5cdFx0XHRcdFx0XHRcdGF1dGhlbnRpY2F0aW9uVHlwZTogXCJPUEVOSURfQ09OTkVDVFwiLFxuXHRcdFx0XHRcdFx0XHRvcGVuSURDb25uZWN0Q29uZmlnOiB7XG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogbW9kZS5vcGVuSWRDb25uZWN0Q29uZmlnPy5vaWRjUHJvdmlkZXIsXG5cdFx0XHRcdFx0XHRcdFx0Ly9pc3N1ZXJVcmw6IG1vZGUub3BlbklkQ29ubmVjdENvbmZpZz8ub2lkY1Byb3ZpZGVyO1xuXHRcdFx0XHRcdFx0XHRcdGNsaWVudElkOiBtb2RlLm9wZW5JZENvbm5lY3RDb25maWc/LmNsaWVudElkLFxuXHRcdFx0XHRcdFx0XHRcdGlhdFRUTDogbW9kZS5vcGVuSWRDb25uZWN0Q29uZmlnPy50b2tlbkV4cGlyeUZyb21Jc3N1ZSxcblx0XHRcdFx0XHRcdFx0XHRhdXRoVFRMOiBtb2RlLm9wZW5JZENvbm5lY3RDb25maWc/LnRva2VuRXhwaXJ5RnJvbUF1dGgsXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdFtBdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0xdOiAoKSA9PiAoe1xuXHRcdFx0XHRcdFx0XHRhdXRoZW50aWNhdGlvblR5cGU6IFwiQU1BWk9OX0NPR05JVE9fVVNFUl9QT09MU1wiLFxuXHRcdFx0XHRcdFx0XHR1c2VyUG9vbENvbmZpZzoge1xuXHRcdFx0XHRcdFx0XHRcdHVzZXJQb29sSWQ6IG1vZGUudXNlclBvb2xDb25maWc/LnVzZXJQb29sLnVzZXJQb29sSWQsXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGF1dGhUeXBlRmFjdG9yeVtcblx0XHRcdFx0XHRcdG1vZGUuYXV0aG9yaXphdGlvblR5cGVcblx0XHRcdFx0XHRdKCkgYXMgQXBwU3luY0F1dGhDb25maWd1cmF0aW9uRW50cnk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgW1xuXHRcdFx0XHRkZWZhdWx0QXV0aG9yaXphdGlvbixcblx0XHRcdFx0Li4uYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2Rlc1xuXHRcdFx0XSA9IHByb3BzLmF1dGhvcml6YXRpb25Db25maWc7XG5cblx0XHRcdGNvbnN0IHRyYW5zZm9ybWVyUHJvcHMgPSB7XG5cdFx0XHRcdGF1dGhDb25maWc6IHtcblx0XHRcdFx0XHRkZWZhdWx0QXV0aGVudGljYXRpb246IGNka0F1dGhUb1RyYW5zZm9ybWVyRW50cnkoXG5cdFx0XHRcdFx0XHRkZWZhdWx0QXV0aG9yaXphdGlvbixcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdGFkZGl0aW9uYWxBdXRoZW50aWNhdGlvblByb3ZpZGVyczogYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2Rlcy5tYXAoXG5cdFx0XHRcdFx0XHRjZGtBdXRoVG9UcmFuc2Zvcm1lckVudHJ5LFxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdH0sXG5cdFx0XHR9IGFzIE1vZGVsQXV0aFRyYW5zZm9ybWVyQ29uZmlnO1xuXG5cdFx0XHRyZXR1cm4gW25ldyBNb2RlbEF1dGhUcmFuc2Zvcm1lcih0cmFuc2Zvcm1lclByb3BzKV07XG5cdFx0fVxuXHRcdHJldHVybiBbbmV3IE1vZGVsQXV0aFRyYW5zZm9ybWVyKCldO1xuXHR9XG5cdGNyZWF0ZVJlc291cmNlcyhcblx0XHRzY29wZTogQ29uc3RydWN0LFxuXHRcdHByb3BzOiBJX0FwcFN5bmNHcWxTY2hlbWFQcm9wcyxcblx0XHRhcGk6IEdyYXBocWxBcGksXG5cdFx0Y2ZTY2hlbWE6IGFueSxcblx0KTogdm9pZCB7XG5cdFx0aW5mbyhcImF1dGggcHJvdmlkZXJcIik7XG5cdFx0Ly8gdGhyb3cgbmV3IEVycm9yKFwiQXV0aCByZWFjaGVkXCIpO1xuXHRcdC8vIHJldHVybiBjYXN0PElfQ29uc3RydWN0TWFwPihcblx0XHQvLyBcdGNyZWF0ZUxhbWJkYURhdGFTb3VyY2Uoc2NvcGUsIHByb3BzLCBhcGksIGNmU2NoZW1hKSxcblx0XHQvLyApO1xuXHR9XG59XG4iXX0=