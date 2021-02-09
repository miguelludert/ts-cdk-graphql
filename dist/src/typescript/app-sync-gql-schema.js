"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = exports.getCfSchema = exports.createResources = exports.getSchemaText = exports.getProviders = exports.AppSyncGqlSchema = void 0;
const core_1 = require("@aws-cdk/core");
const aws_appsync_1 = require("@aws-cdk/aws-appsync");
const graphql_transformer_core_1 = require("graphql-transformer-core");
const constants_1 = require("../constants");
const providers_1 = require("./providers");
const functions_1 = require("../providers/functions");
const utils_1 = require("./utils");
const fs_1 = require("fs");
const self = __importStar(require("./app-sync-gql-schema"));
class AppSyncGqlSchema extends core_1.NestedStack {
    constructor(scope, name, props) {
        super(scope, name);
        if (!props.namingConvention) {
            props.namingConvention = (name) => name;
        }
        const baseName = props.baseName || name;
        utils_1.info("getProviders");
        const providers = self.getProviders(props);
        utils_1.info("getSchemaText");
        const schemaText = self.getSchemaText(props);
        utils_1.info("getCfSchema");
        const cfSchema = self.getCfSchema(schemaText, providers);
        // output as soon as schemas are available for debugging
        if (props.outputGraphqlSchemaFilePath) {
            fs_1.writeFileSync(props.outputGraphqlSchemaFilePath, cfSchema.schema, "utf8");
        }
        if (props.outputCfnSchemaFilePath) {
            fs_1.writeFileSync(props.outputCfnSchemaFilePath, JSON.stringify(cfSchema, null, 2), "utf8");
        }
        utils_1.info("createApi");
        const api = self.createApi(scope, props, cfSchema.schema);
        utils_1.info("createResources");
        const datasources = exports.createResources(this, props, api, providers, cfSchema);
        // Object.assign(this, datasources);
        //set graphqlApiUrl
        //set
        //throw new Error("STOP");
    }
}
exports.AppSyncGqlSchema = AppSyncGqlSchema;
const getProviders = (props) => {
    const defaultDatasourceProviders = [
        new providers_1.DynamoDatasourceProvider(),
        new providers_1.LambdaDatasourceProvider(),
    ];
    const datasourceProviders = props && props.datasourceProviders ? props.datasourceProviders : [];
    return [...defaultDatasourceProviders, ...datasourceProviders];
};
exports.getProviders = getProviders;
const getSchemaText = (props) => {
    if (!props.schemaFile && !props.schemaText) {
        throw new Error(constants_1.NO_SCHEMA_ERROR_MESSAGE);
    }
    const { schemaText, schemaFile } = props;
    if (schemaFile) {
        return utils_1.cast(utils_1.readFileSync(schemaFile, "utf8"));
    }
    else {
        return schemaText;
    }
};
exports.getSchemaText = getSchemaText;
const createResources = (scope, props, api, providers, cfSchema) => {
    const resources = providers.flatMap((provider) => provider.createResources(scope, props, api, cfSchema));
    const tables = resources.filter(f => f.table).map(f => f.table);
    const lambdas = resources.filter(f => f.lambda).map(f => f.lambda);
    lambdas.forEach((lambda) => {
        tables.forEach((table) => {
            table.grantFullAccess(lambda);
        });
    });
    const { funcs, resolvers } = (functions_1.createResolversAndFunctionsFromSchema(scope, props, api, cfSchema, resources));
};
exports.createResources = createResources;
const getCfSchema = (schemaText, providers) => {
    const transformers = providers.flatMap((provider) => provider.getTransformer());
    const gqlTransform = new graphql_transformer_core_1.GraphQLTransform({
        transformers,
    });
    const cfSchema = gqlTransform.transform(schemaText);
    return cfSchema;
};
exports.getCfSchema = getCfSchema;
const createApi = (scope, props, schemaText) => {
    const result = utils_1.createConstruct(scope, props, aws_appsync_1.GraphqlApi, "gql-api");
    // this is a hack for the CFN to receive the schema text.
    result.schemaResource.definition = schemaText;
    return result;
};
exports.createApi = createApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMtZ3FsLXNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90eXBlc2NyaXB0L2FwcC1zeW5jLWdxbC1zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdDQUF1RDtBQUN2RCxzREFBa0Q7QUFDbEQsdUVBQTREO0FBRTVELDRDQUF1RDtBQUN2RCwyQ0FJcUI7QUFDckIsc0RBQStFO0FBRS9FLG1DQUFvRTtBQUNwRSwyQkFBbUM7QUFDbkMsNERBQThDO0FBUTlDLE1BQWEsZ0JBQWlCLFNBQVEsa0JBQVc7SUFDaEQsWUFBWSxLQUFnQixFQUFFLElBQVksRUFBRSxLQUE4QjtRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRW5CLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7WUFDNUIsS0FBSyxDQUFDLGdCQUFnQixHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDeEM7UUFFRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztRQUN4QyxZQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxZQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxZQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFekQsd0RBQXdEO1FBQ3hELElBQUksS0FBSyxDQUFDLDJCQUEyQixFQUFFO1lBQ3RDLGtCQUFhLENBQUMsS0FBSyxDQUFDLDJCQUEyQixF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QyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUVGLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEdBQVEsQ0FDakMsaURBQXFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUM3RSxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBdEJXLFFBQUEsZUFBZSxtQkFzQjFCO0FBRUssTUFBTSxXQUFXLEdBQUcsQ0FDMUIsVUFBa0IsRUFDbEIsU0FBaUMsRUFDM0IsRUFBRTtJQUNSLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUNuRCxRQUFRLENBQUMsY0FBYyxFQUFFLENBQ3pCLENBQUM7SUFDRixNQUFNLFlBQVksR0FBRyxJQUFJLDJDQUFnQixDQUFDO1FBQ3pDLFlBQVk7S0FDWixDQUFDLENBQUM7SUFDSCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BELE9BQU8sUUFBUSxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQVpXLFFBQUEsV0FBVyxlQVl0QjtBQUVLLE1BQU0sU0FBUyxHQUFHLENBQ3hCLEtBQWdCLEVBQ2hCLEtBQThCLEVBQzlCLFVBQWtCLEVBQ0wsRUFBRTtJQUNmLE1BQU0sTUFBTSxHQUFHLHVCQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSx3QkFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3BFLHlEQUF5RDtJQUN6RCxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDOUMsT0FBTyxNQUFNLENBQUM7QUFDZixDQUFDLENBQUM7QUFUVyxRQUFBLFNBQVMsYUFTcEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QsIE5lc3RlZFN0YWNrIH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcbmltcG9ydCB7IEdyYXBocWxBcGkgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWFwcHN5bmNcIjtcbmltcG9ydCB7IEdyYXBoUUxUcmFuc2Zvcm0gfSBmcm9tIFwiZ3JhcGhxbC10cmFuc2Zvcm1lci1jb3JlXCI7XG5pbXBvcnQgeyBJX0FwcFN5bmNHcWxTY2hlbWFQcm9wcywgSV9EYXRhc291cmNlUHJvdmlkZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBOT19TQ0hFTUFfRVJST1JfTUVTU0FHRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7XG5cdER5bmFtb0RhdGFzb3VyY2VQcm92aWRlcixcblx0TGFtYmRhRGF0YXNvdXJjZVByb3ZpZGVyLFxuXHQvL0F1dGhEYXRhc291cmNlUHJvdmlkZXJcbn0gZnJvbSBcIi4vcHJvdmlkZXJzXCI7XG5pbXBvcnQgeyBjcmVhdGVSZXNvbHZlcnNBbmRGdW5jdGlvbnNGcm9tU2NoZW1hIH0gZnJvbSBcIi4uL3Byb3ZpZGVycy9mdW5jdGlvbnNcIjtcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSBcImRlZXBtZXJnZVwiO1xuaW1wb3J0IHsgY2FzdCwgcmVhZEZpbGVTeW5jLCBjcmVhdGVDb25zdHJ1Y3QsIGluZm8gfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgd3JpdGVGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgc2VsZiBmcm9tIFwiLi9hcHAtc3luYy1ncWwtc2NoZW1hXCI7XG5pbXBvcnQgeyBoZWxwSW5mb3JtYXRpb24gfSBmcm9tIFwiY29tbWFuZGVyXCI7XG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gXCJAYXdzLWNkay9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCB7IEZ1bmN0aW9uIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IExhbWJkYSB9IGZyb20gXCJhd3Mtc2RrXCI7XG5cblxuXG5leHBvcnQgY2xhc3MgQXBwU3luY0dxbFNjaGVtYSBleHRlbmRzIE5lc3RlZFN0YWNrIHtcblx0Y29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgbmFtZTogc3RyaW5nLCBwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMpIHtcblx0XHRzdXBlcihzY29wZSwgbmFtZSk7XG5cblx0XHRpZiAoIXByb3BzLm5hbWluZ0NvbnZlbnRpb24pIHtcblx0XHRcdHByb3BzLm5hbWluZ0NvbnZlbnRpb24gPSAobmFtZSkgPT4gbmFtZTtcblx0XHR9XG5cblx0XHRjb25zdCBiYXNlTmFtZSA9IHByb3BzLmJhc2VOYW1lIHx8IG5hbWU7XG5cdFx0aW5mbyhcImdldFByb3ZpZGVyc1wiKTtcblx0XHRjb25zdCBwcm92aWRlcnMgPSBzZWxmLmdldFByb3ZpZGVycyhwcm9wcyk7XG5cdFx0aW5mbyhcImdldFNjaGVtYVRleHRcIik7XG5cdFx0Y29uc3Qgc2NoZW1hVGV4dCA9IHNlbGYuZ2V0U2NoZW1hVGV4dChwcm9wcyk7XG5cdFx0aW5mbyhcImdldENmU2NoZW1hXCIpO1xuXHRcdGNvbnN0IGNmU2NoZW1hID0gc2VsZi5nZXRDZlNjaGVtYShzY2hlbWFUZXh0LCBwcm92aWRlcnMpO1xuXG5cdFx0Ly8gb3V0cHV0IGFzIHNvb24gYXMgc2NoZW1hcyBhcmUgYXZhaWxhYmxlIGZvciBkZWJ1Z2dpbmdcblx0XHRpZiAocHJvcHMub3V0cHV0R3JhcGhxbFNjaGVtYUZpbGVQYXRoKSB7XG5cdFx0XHR3cml0ZUZpbGVTeW5jKHByb3BzLm91dHB1dEdyYXBocWxTY2hlbWFGaWxlUGF0aCwgY2ZTY2hlbWEuc2NoZW1hLCBcInV0ZjhcIik7XG5cdFx0fVxuXG5cdFx0aWYgKHByb3BzLm91dHB1dENmblNjaGVtYUZpbGVQYXRoKSB7XG5cdFx0XHR3cml0ZUZpbGVTeW5jKFxuXHRcdFx0XHRwcm9wcy5vdXRwdXRDZm5TY2hlbWFGaWxlUGF0aCxcblx0XHRcdFx0SlNPTi5zdHJpbmdpZnkoY2ZTY2hlbWEsIG51bGwsIDIpLFxuXHRcdFx0XHRcInV0ZjhcIixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aW5mbyhcImNyZWF0ZUFwaVwiKTtcblx0XHRjb25zdCBhcGkgPSBzZWxmLmNyZWF0ZUFwaShzY29wZSwgcHJvcHMsIGNmU2NoZW1hLnNjaGVtYSk7XG5cdFx0aW5mbyhcImNyZWF0ZVJlc291cmNlc1wiKTtcblx0XHRjb25zdCBkYXRhc291cmNlcyA9IGNyZWF0ZVJlc291cmNlcyh0aGlzLCBwcm9wcywgYXBpLCBwcm92aWRlcnMsIGNmU2NoZW1hKTtcblx0XHQvLyBPYmplY3QuYXNzaWduKHRoaXMsIGRhdGFzb3VyY2VzKTtcblxuXHRcdC8vc2V0IGdyYXBocWxBcGlVcmxcblx0XHQvL3NldFxuXHRcdC8vdGhyb3cgbmV3IEVycm9yKFwiU1RPUFwiKTtcblx0fVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UHJvdmlkZXJzID0gKFxuXHRwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMsXG4pOiBJX0RhdGFzb3VyY2VQcm92aWRlcltdID0+IHtcblx0Y29uc3QgZGVmYXVsdERhdGFzb3VyY2VQcm92aWRlcnM6IElfRGF0YXNvdXJjZVByb3ZpZGVyW10gPSBbXG5cdFx0bmV3IER5bmFtb0RhdGFzb3VyY2VQcm92aWRlcigpLFxuXHRcdG5ldyBMYW1iZGFEYXRhc291cmNlUHJvdmlkZXIoKSxcblx0XHQvL25ldyBBdXRoRGF0YXNvdXJjZVByb3ZpZGVyKCksXG5cdF07XG5cdGNvbnN0IGRhdGFzb3VyY2VQcm92aWRlcnMgPVxuXHRcdHByb3BzICYmIHByb3BzLmRhdGFzb3VyY2VQcm92aWRlcnMgPyBwcm9wcy5kYXRhc291cmNlUHJvdmlkZXJzIDogW107XG5cdHJldHVybiBbLi4uZGVmYXVsdERhdGFzb3VyY2VQcm92aWRlcnMsIC4uLmRhdGFzb3VyY2VQcm92aWRlcnNdO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFNjaGVtYVRleHQgPSAocHJvcHM6IElfQXBwU3luY0dxbFNjaGVtYVByb3BzKTogc3RyaW5nID0+IHtcblx0aWYgKCFwcm9wcy5zY2hlbWFGaWxlICYmICFwcm9wcy5zY2hlbWFUZXh0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKE5PX1NDSEVNQV9FUlJPUl9NRVNTQUdFKTtcblx0fVxuXHRjb25zdCB7IHNjaGVtYVRleHQsIHNjaGVtYUZpbGUgfSA9IHByb3BzO1xuXHRpZiAoc2NoZW1hRmlsZSkge1xuXHRcdHJldHVybiBjYXN0PHN0cmluZz4ocmVhZEZpbGVTeW5jKHNjaGVtYUZpbGUsIFwidXRmOFwiKSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIDxzdHJpbmc+c2NoZW1hVGV4dDtcblx0fVxufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlc291cmNlcyA9IChcblx0c2NvcGU6IENvbnN0cnVjdCxcblx0cHJvcHM6IElfQXBwU3luY0dxbFNjaGVtYVByb3BzLFxuXHRhcGk6IEdyYXBocWxBcGksXG5cdHByb3ZpZGVyczogSV9EYXRhc291cmNlUHJvdmlkZXJbXSxcblx0Y2ZTY2hlbWE6IG9iamVjdCxcbikgPT4ge1xuXHRjb25zdCByZXNvdXJjZXMgPSBwcm92aWRlcnMuZmxhdE1hcCgocHJvdmlkZXIpID0+XG5cdFx0cHJvdmlkZXIuY3JlYXRlUmVzb3VyY2VzKHNjb3BlLCBwcm9wcywgYXBpLCBjZlNjaGVtYSksXG5cdCk7XG5cdGNvbnN0IHRhYmxlcyA9IHJlc291cmNlcy5maWx0ZXIoZiA9PiBmLnRhYmxlKS5tYXAoZiA9PiBmLnRhYmxlKTtcblx0Y29uc3QgbGFtYmRhcyA9IHJlc291cmNlcy5maWx0ZXIoZiA9PiBmLmxhbWJkYSkubWFwKGYgPT4gZi5sYW1iZGEpO1xuXG5cdGxhbWJkYXMuZm9yRWFjaCgobGFtYmRhIDogRnVuY3Rpb24pID0+IHsgXG5cdFx0dGFibGVzLmZvckVhY2goKHRhYmxlIDogVGFibGUpID0+IHtcblx0XHRcdHRhYmxlLmdyYW50RnVsbEFjY2VzcyhsYW1iZGEpO1xuXHRcdH0pXG5cdH0pXG5cblx0Y29uc3QgeyBmdW5jcywgcmVzb2x2ZXJzIH0gPSA8YW55Pihcblx0XHRjcmVhdGVSZXNvbHZlcnNBbmRGdW5jdGlvbnNGcm9tU2NoZW1hKHNjb3BlLCBwcm9wcywgYXBpLCBjZlNjaGVtYSwgcmVzb3VyY2VzKVxuXHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldENmU2NoZW1hID0gKFxuXHRzY2hlbWFUZXh0OiBzdHJpbmcsXG5cdHByb3ZpZGVyczogSV9EYXRhc291cmNlUHJvdmlkZXJbXSxcbik6IGFueSA9PiB7XG5cdGNvbnN0IHRyYW5zZm9ybWVycyA9IHByb3ZpZGVycy5mbGF0TWFwKChwcm92aWRlcikgPT5cblx0XHRwcm92aWRlci5nZXRUcmFuc2Zvcm1lcigpLFxuXHQpO1xuXHRjb25zdCBncWxUcmFuc2Zvcm0gPSBuZXcgR3JhcGhRTFRyYW5zZm9ybSh7XG5cdFx0dHJhbnNmb3JtZXJzLFxuXHR9KTtcblx0Y29uc3QgY2ZTY2hlbWEgPSBncWxUcmFuc2Zvcm0udHJhbnNmb3JtKHNjaGVtYVRleHQpO1xuXHRyZXR1cm4gY2ZTY2hlbWE7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQXBpID0gKFxuXHRzY29wZTogQ29uc3RydWN0LFxuXHRwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMsXG5cdHNjaGVtYVRleHQ6IHN0cmluZyxcbik6IEdyYXBocWxBcGkgPT4ge1xuXHRjb25zdCByZXN1bHQgPSBjcmVhdGVDb25zdHJ1Y3Qoc2NvcGUsIHByb3BzLCBHcmFwaHFsQXBpLCBcImdxbC1hcGlcIik7XG5cdC8vIHRoaXMgaXMgYSBoYWNrIGZvciB0aGUgQ0ZOIHRvIHJlY2VpdmUgdGhlIHNjaGVtYSB0ZXh0LlxuXHRyZXN1bHQuc2NoZW1hUmVzb3VyY2UuZGVmaW5pdGlvbiA9IHNjaGVtYVRleHQ7XG5cdHJldHVybiByZXN1bHQ7XG59O1xuIl19