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
        const cfSchema = self.getCfSchema(schemaText, providers, props);
        // output as soon as schemas are available for debugging
        if (props.outputGraphqlSchemaFilePath) {
            fs_1.writeFileSync(props.outputGraphqlSchemaFilePath, cfSchema.schema, "utf8");
        }
        if (props.outputCfnSchemaFilePath) {
            fs_1.writeFileSync(props.outputCfnSchemaFilePath, JSON.stringify(cfSchema, null, 2), "utf8");
        }
        utils_1.info("createApi", "PROPS", !!props, !!props.authorizationConfig);
        const api = self.createApi(scope, props, cfSchema.schema);
        this.api = api;
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
        new providers_1.AuthDatasourceProvider(),
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
    const resources = providers.flatMap((provider) => provider.createResources(scope, props, api, cfSchema)).filter(f => f);
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
const getCfSchema = (schemaText, providers, props) => {
    const transformers = providers.flatMap((provider) => provider.getTransformer(props));
    const gqlTransform = new graphql_transformer_core_1.GraphQLTransform({
        transformers,
    });
    const cfSchema = gqlTransform.transform(schemaText);
    return cfSchema;
};
exports.getCfSchema = getCfSchema;
const createApi = (scope, props, schemaText) => {
    const result = utils_1.createConstruct(scope, props, aws_appsync_1.GraphqlApi, "");
    // this is a hack for the CFN to receive the schema text.
    result.schemaResource.definition = schemaText;
    return result;
};
exports.createApi = createApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMtZ3FsLXNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90eXBlc2NyaXB0L2FwcC1zeW5jLWdxbC1zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdDQUF1RDtBQUN2RCxzREFBa0Q7QUFDbEQsdUVBQTREO0FBRTVELDRDQUF1RDtBQUN2RCwyQ0FLcUI7QUFDckIsc0RBQStFO0FBRS9FLG1DQUFvRTtBQUNwRSwyQkFBbUM7QUFDbkMsNERBQThDO0FBTTlDLE1BQWEsZ0JBQWlCLFNBQVEsa0JBQVc7SUFJaEQsWUFBWSxLQUFnQixFQUFFLElBQVksRUFBRSxLQUE4QjtRQUN6RSxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRW5CLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7WUFDNUIsS0FBSyxDQUFDLGdCQUFnQixHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDeEM7UUFFRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQztRQUN4QyxZQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxZQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxZQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWhFLHdEQUF3RDtRQUN4RCxJQUFJLEtBQUssQ0FBQywyQkFBMkIsRUFBRTtZQUN0QyxrQkFBYSxDQUFDLEtBQUssQ0FB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LHlEQUF5RDtJQUN6RCxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDOUMsT0FBTyxNQUFNLENBQUM7QUFDZixDQUFDLENBQUM7QUFUVyxRQUFBLFNBQVMsYUFTcEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QsIE5lc3RlZFN0YWNrIH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcbmltcG9ydCB7IEdyYXBocWxBcGkgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWFwcHN5bmNcIjtcbmltcG9ydCB7IEdyYXBoUUxUcmFuc2Zvcm0gfSBmcm9tIFwiZ3JhcGhxbC10cmFuc2Zvcm1lci1jb3JlXCI7XG5pbXBvcnQgeyBJX0FwcFN5bmNHcWxTY2hlbWFQcm9wcywgSV9EYXRhc291cmNlUHJvdmlkZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBOT19TQ0hFTUFfRVJST1JfTUVTU0FHRSB9IGZyb20gXCIuLi9jb25zdGFudHNcIjtcbmltcG9ydCB7XG5cdEF1dGhEYXRhc291cmNlUHJvdmlkZXIsXG5cdER5bmFtb0RhdGFzb3VyY2VQcm92aWRlcixcblx0TGFtYmRhRGF0YXNvdXJjZVByb3ZpZGVyLFxuXHQvL0F1dGhEYXRhc291cmNlUHJvdmlkZXJcbn0gZnJvbSBcIi4vcHJvdmlkZXJzXCI7XG5pbXBvcnQgeyBjcmVhdGVSZXNvbHZlcnNBbmRGdW5jdGlvbnNGcm9tU2NoZW1hIH0gZnJvbSBcIi4uL3Byb3ZpZGVycy9mdW5jdGlvbnNcIjtcbmltcG9ydCBkZWVwbWVyZ2UgZnJvbSBcImRlZXBtZXJnZVwiO1xuaW1wb3J0IHsgY2FzdCwgcmVhZEZpbGVTeW5jLCBjcmVhdGVDb25zdHJ1Y3QsIGluZm8gfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgd3JpdGVGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0ICogYXMgc2VsZiBmcm9tIFwiLi9hcHAtc3luYy1ncWwtc2NoZW1hXCI7XG5pbXBvcnQgeyBoZWxwSW5mb3JtYXRpb24gfSBmcm9tIFwiY29tbWFuZGVyXCI7XG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gXCJAYXdzLWNkay9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCB7IEZ1bmN0aW9uIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IExhbWJkYSB9IGZyb20gXCJhd3Mtc2RrXCI7XG5cbmV4cG9ydCBjbGFzcyBBcHBTeW5jR3FsU2NoZW1hIGV4dGVuZHMgTmVzdGVkU3RhY2sge1xuXG5cdGFwaSA6IEdyYXBocWxBcGk7XG5cblx0Y29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgbmFtZTogc3RyaW5nLCBwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMpIHtcblx0XHRzdXBlcihzY29wZSwgbmFtZSk7XG5cblx0XHRpZiAoIXByb3BzLm5hbWluZ0NvbnZlbnRpb24pIHtcblx0XHRcdHByb3BzLm5hbWluZ0NvbnZlbnRpb24gPSAobmFtZSkgPT4gbmFtZTtcblx0XHR9XG5cblx0XHRjb25zdCBiYXNlTmFtZSA9IHByb3BzLmJhc2VOYW1lIHx8IG5hbWU7XG5cdFx0aW5mbyhcImdldFByb3ZpZGVyc1wiKTtcblx0XHRjb25zdCBwcm92aWRlcnMgPSBzZWxmLmdldFByb3ZpZGVycyhwcm9wcyk7XG5cdFx0aW5mbyhcImdldFNjaGVtYVRleHRcIik7XG5cdFx0Y29uc3Qgc2NoZW1hVGV4dCA9IHNlbGYuZ2V0U2NoZW1hVGV4dChwcm9wcyk7XG5cdFx0aW5mbyhcImdldENmU2NoZW1hXCIpO1xuXHRcdGNvbnN0IGNmU2NoZW1hID0gc2VsZi5nZXRDZlNjaGVtYShzY2hlbWFUZXh0LCBwcm92aWRlcnMsIHByb3BzKTtcblxuXHRcdC8vIG91dHB1dCBhcyBzb29uIGFzIHNjaGVtYXMgYXJlIGF2YWlsYWJsZSBmb3IgZGVidWdnaW5nXG5cdFx0aWYgKHByb3BzLm91dHB1dEdyYXBocWxTY2hlbWFGaWxlUGF0aCkge1xuXHRcdFx0d3JpdGVGaWxlU3luYyhwcm9wcy5vdXRwdXRHcmFwaHFsU2NoZW1hRmlsZVBhdGgsIGNmU2NoZW1hLnNjaGVtYSwgXCJ1dGY4XCIpO1xuXHRcdH1cblxuXHRcdGlmIChwcm9wcy5vdXRwdXRDZm5TY2hlbWFGaWxlUGF0aCkge1xuXHRcdFx0d3JpdGVGaWxlU3luYyhcblx0XHRcdFx0cHJvcHMub3V0cHV0Q2ZuU2NoZW1hRmlsZVBhdGgsXG5cdFx0XHRcdEpTT04uc3RyaW5naWZ5KGNmU2NoZW1hLCBudWxsLCAyKSxcblx0XHRcdFx0XCJ1dGY4XCIsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGluZm8oXCJjcmVhdGVBcGlcIiwgXCJQUk9QU1wiLCAhIXByb3BzLCAhIXByb3BzLmF1dGhvcml6YXRpb25Db25maWcpO1xuXHRcdGNvbnN0IGFwaSA9IHNlbGYuY3JlYXRlQXBpKHNjb3BlLCBwcm9wcywgY2ZTY2hlbWEuc2NoZW1hKTtcblx0XHR0aGlzLmFwaSA9IGFwaTtcblxuXHRcdGluZm8oXCJjcmVhdGVSZXNvdXJjZXNcIik7XG5cdFx0Y29uc3QgZGF0YXNvdXJjZXMgPSBjcmVhdGVSZXNvdXJjZXModGhpcywgcHJvcHMsIGFwaSwgcHJvdmlkZXJzLCBjZlNjaGVtYSk7XG5cdFx0Ly8gT2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhc291cmNlcyk7XG5cblx0XHQvL3NldCBncmFwaHFsQXBpVXJsXG5cdFx0Ly9zZXRcblx0XHQvL3Rocm93IG5ldyBFcnJvcihcIlNUT1BcIik7XG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFByb3ZpZGVycyA9IChcblx0cHJvcHM6IElfQXBwU3luY0dxbFNjaGVtYVByb3BzLFxuKTogSV9EYXRhc291cmNlUHJvdmlkZXJbXSA9PiB7XG5cdGNvbnN0IGRlZmF1bHREYXRhc291cmNlUHJvdmlkZXJzOiBJX0RhdGFzb3VyY2VQcm92aWRlcltdID0gW1xuXHRcdG5ldyBEeW5hbW9EYXRhc291cmNlUHJvdmlkZXIoKSxcblx0XHRuZXcgTGFtYmRhRGF0YXNvdXJjZVByb3ZpZGVyKCksXG5cdFx0bmV3IEF1dGhEYXRhc291cmNlUHJvdmlkZXIoKSxcblx0XTtcblx0Y29uc3QgZGF0YXNvdXJjZVByb3ZpZGVycyA9XG5cdFx0cHJvcHMgJiYgcHJvcHMuZGF0YXNvdXJjZVByb3ZpZGVycyA/IHByb3BzLmRhdGFzb3VyY2VQcm92aWRlcnMgOiBbXTtcblx0cmV0dXJuIFsuLi5kZWZhdWx0RGF0YXNvdXJjZVByb3ZpZGVycywgLi4uZGF0YXNvdXJjZVByb3ZpZGVyc107XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2NoZW1hVGV4dCA9IChwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMpOiBzdHJpbmcgPT4ge1xuXHRpZiAoIXByb3BzLnNjaGVtYUZpbGUgJiYgIXByb3BzLnNjaGVtYVRleHQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoTk9fU0NIRU1BX0VSUk9SX01FU1NBR0UpO1xuXHR9XG5cdGNvbnN0IHsgc2NoZW1hVGV4dCwgc2NoZW1hRmlsZSB9ID0gcHJvcHM7XG5cdGlmIChzY2hlbWFGaWxlKSB7XG5cdFx0cmV0dXJuIGNhc3Q8c3RyaW5nPihyZWFkRmlsZVN5bmMoc2NoZW1hRmlsZSwgXCJ1dGY4XCIpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gPHN0cmluZz5zY2hlbWFUZXh0O1xuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlUmVzb3VyY2VzID0gKFxuXHRzY29wZTogQ29uc3RydWN0LFxuXHRwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMsXG5cdGFwaTogR3JhcGhxbEFwaSxcblx0cHJvdmlkZXJzOiBJX0RhdGFzb3VyY2VQcm92aWRlcltdLFxuXHRjZlNjaGVtYTogb2JqZWN0LFxuKSA9PiB7XG5cdGNvbnN0IHJlc291cmNlcyA9IHByb3ZpZGVycy5mbGF0TWFwKChwcm92aWRlcikgPT5cblx0XHRwcm92aWRlci5jcmVhdGVSZXNvdXJjZXMoc2NvcGUsIHByb3BzLCBhcGksIGNmU2NoZW1hKSxcblx0KS5maWx0ZXIoZiA9PiBmKTtcblx0Y29uc3QgdGFibGVzID0gcmVzb3VyY2VzLmZpbHRlcihmID0+IGYudGFibGUpLm1hcChmID0+IGYudGFibGUpO1xuXHRjb25zdCBsYW1iZGFzID0gcmVzb3VyY2VzLmZpbHRlcihmID0+IGYubGFtYmRhKS5tYXAoZiA9PiBmLmxhbWJkYSk7XG5cblx0bGFtYmRhcy5mb3JFYWNoKChsYW1iZGEgOiBGdW5jdGlvbikgPT4geyBcblx0XHR0YWJsZXMuZm9yRWFjaCgodGFibGUgOiBUYWJsZSkgPT4ge1xuXHRcdFx0dGFibGUuZ3JhbnRGdWxsQWNjZXNzKGxhbWJkYSk7XG5cdFx0fSlcblx0fSlcblxuXHRjb25zdCB7IGZ1bmNzLCByZXNvbHZlcnMgfSA9IDxhbnk+KFxuXHRcdGNyZWF0ZVJlc29sdmVyc0FuZEZ1bmN0aW9uc0Zyb21TY2hlbWEoc2NvcGUsIHByb3BzLCBhcGksIGNmU2NoZW1hLCByZXNvdXJjZXMpXG5cdCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Q2ZTY2hlbWEgPSAoXG5cdHNjaGVtYVRleHQ6IHN0cmluZyxcblx0cHJvdmlkZXJzOiBJX0RhdGFzb3VyY2VQcm92aWRlcltdLFxuXHRwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMsXG4pOiBhbnkgPT4ge1xuXHRjb25zdCB0cmFuc2Zvcm1lcnMgPSBwcm92aWRlcnMuZmxhdE1hcCgocHJvdmlkZXIpID0+XG5cdFx0cHJvdmlkZXIuZ2V0VHJhbnNmb3JtZXIocHJvcHMpLFxuXHQpO1xuXHRjb25zdCBncWxUcmFuc2Zvcm0gPSBuZXcgR3JhcGhRTFRyYW5zZm9ybSh7XG5cdFx0dHJhbnNmb3JtZXJzLFxuXHR9KTtcblx0Y29uc3QgY2ZTY2hlbWEgPSBncWxUcmFuc2Zvcm0udHJhbnNmb3JtKHNjaGVtYVRleHQpO1xuXHRyZXR1cm4gY2ZTY2hlbWE7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQXBpID0gKFxuXHRzY29wZTogQ29uc3RydWN0LFxuXHRwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMsXG5cdHNjaGVtYVRleHQ6IHN0cmluZyxcbik6IEdyYXBocWxBcGkgPT4ge1xuXHRjb25zdCByZXN1bHQgPSBjcmVhdGVDb25zdHJ1Y3Qoc2NvcGUsIHByb3BzLCBHcmFwaHFsQXBpLCBcIlwiKTtcblx0Ly8gdGhpcyBpcyBhIGhhY2sgZm9yIHRoZSBDRk4gdG8gcmVjZWl2ZSB0aGUgc2NoZW1hIHRleHQuXG5cdHJlc3VsdC5zY2hlbWFSZXNvdXJjZS5kZWZpbml0aW9uID0gc2NoZW1hVGV4dDtcblx0cmV0dXJuIHJlc3VsdDtcbn07XG4iXX0=