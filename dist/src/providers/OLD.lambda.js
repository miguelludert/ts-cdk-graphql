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
exports.createLambdaStack = exports.getLambdaDataSources = exports.createLambdaResolverProp = exports.createLambdaDataSourceProps = exports.getStack = void 0;
const self = __importStar(require("./lambda"));
const ramda_1 = require("ramda");
const utils_1 = require("./utils");
const path_1 = require("path");
const change_case_1 = require("change-case");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const aws_appsync_1 = require("@aws-cdk/aws-appsync");
exports.getStack = ramda_1.curry((codegen, name) => {
    const result = ramda_1.view(ramda_1.lensPath(["stacks", "FunctionDirectiveStack", "Resources", name]), codegen);
    return result;
});
exports.createLambdaDataSourceProps = ramda_1.curry((options, codegen, resolverName) => {
    const { lambdaSrcPath } = options;
    const queryResolverStack = exports.getStack(codegen, resolverName);
    const fieldName = queryResolverStack.Properties.FieldName;
    const invokerName = queryResolverStack.DependsOn;
    const dataSourceName = exports.getStack(codegen, invokerName).DependsOn;
    const functionName = change_case_1.paramCase(fieldName);
    const functionSrcPath = path_1.join(lambdaSrcPath, change_case_1.paramCase(functionName));
    return {
        dataSourceName: change_case_1.camelCase(dataSourceName),
        functionName,
        functionProps: {
            handler: "index.handler",
            functionSrcPath,
            functionName,
        },
    };
});
const createLambdaResolverProp = (options, codegen, dataSourceName) => {
    const { DependsOn, Properties: { FieldName, TypeName }, } = exports.getStack(codegen, dataSourceName);
    return {
        resolver: {
            fieldName: FieldName,
            typeName: TypeName,
            requestMappingTemplate: codegen.pipelineFunctions[`${DependsOn}.req.vtl`],
            responseMappingTemplate: codegen.pipelineFunctions[`${DependsOn}.res.vtl`],
        },
    };
};
exports.createLambdaResolverProp = createLambdaResolverProp;
const getLambdaDataSources = (options, codegen) => {
    const stackMapping = ramda_1.toPairs(codegen.stackMapping);
    const resolvers = ramda_1.pipe(ramda_1.filter(([key, value]) => value == "FunctionDirectiveStack" && key.endsWith("Resolver")), ramda_1.map(ramda_1.head))(stackMapping);
    return ramda_1.map(resolverName => (Object.assign(Object.assign({}, self.createLambdaDataSourceProps(options, codegen, resolverName)), self.createLambdaResolverProp(options, codegen, resolverName))), resolvers);
};
exports.getLambdaDataSources = getLambdaDataSources;
exports.createLambdaStack = ramda_1.curry((scope, options, api, stackProps) => {
    const { dataSourceName, dataSourceProps, functionName, functionProps, resolver, } = stackProps;
    const thisFunctionProps = utils_1.getProps("FunctionProps", "", functionProps);
    const lambda = new aws_lambda_1.Function(scope, functionName, Object.assign(Object.assign({}, thisFunctionProps), { runtime: aws_lambda_1.Runtime.NODEJS_12_X, code: aws_lambda_1.Code.fromAsset(thisFunctionProps.functionSrcPath) }));
    const dataSource = new aws_appsync_1.LambdaDataSource(scope, dataSourceName, {
        api,
        name: dataSourceName,
        lambdaFunction: lambda,
    });
    const thisResolverProps = utils_1.createBaseResolverProps(resolver);
    const thisResolver = dataSource.createResolver(thisResolverProps);
    console.info(thisResolverProps);
    return {
        lambda,
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT0xELmxhbWJkYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvT0xELmxhbWJkYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQWlDO0FBQ2pDLGlDQVllO0FBQ2YsbUNBQTREO0FBQzVELCtCQUE0QjtBQUM1Qiw2Q0FBbUQ7QUFDbkQsb0RBQThEO0FBQzlELHNEQUF3RDtBQUUzQyxRQUFBLFFBQVEsR0FBRyxhQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDL0MsTUFBTSxNQUFNLEdBQUcsWUFBSSxDQUNsQixnQkFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLHdCQUF3QixFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUNqRSxPQUFPLENBQ1AsQ0FBQztJQUNGLE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQyxDQUFDLENBQUM7QUFFVSxRQUFBLDJCQUEyQixHQUFHLGFBQUssQ0FDL0MsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFO0lBQ2xDLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFDbEMsTUFBTSxrQkFBa0IsR0FBRyxnQkFBUSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUMzRCxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO0lBQzFELE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztJQUNqRCxNQUFNLGNBQWMsR0FBRyxnQkFBUSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDaEUsTUFBTSxZQUFZLEdBQUcsdUJBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxNQUFNLGVBQWUsR0FBRyxXQUFJLENBQUMsYUFBYSxFQUFFLHVCQUFTLENBQUMsWUFBWSxDQUFDLENB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QUM7QUFDSCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNlbGYgZnJvbSBcIi4vbGFtYmRhXCI7XG5pbXBvcnQge1xuXHRjdXJyeSxcblx0Y29uY2F0LFxuXHRmaWx0ZXIsXG5cdGhlYWQsXG5cdG1hcCxcblx0cGlwZSxcblx0cmVkdWNlLFxuXHR0b1BhaXJzLFxuXHR2YWx1ZXMsXG5cdHZpZXcsXG5cdGxlbnNQYXRoLFxufSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCB7IGdldFByb3BzLCBjcmVhdGVCYXNlUmVzb2x2ZXJQcm9wcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IHBhcmFtQ2FzZSwgY2FtZWxDYXNlIH0gZnJvbSBcImNoYW5nZS1jYXNlXCI7XG5pbXBvcnQgeyBSdW50aW1lLCBGdW5jdGlvbiwgQ29kZSB9IGZyb20gXCJAYXdzLWNkay9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBMYW1iZGFEYXRhU291cmNlIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1hcHBzeW5jXCI7XG5cbmV4cG9ydCBjb25zdCBnZXRTdGFjayA9IGN1cnJ5KChjb2RlZ2VuLCBuYW1lKSA9PiB7XG5cdGNvbnN0IHJlc3VsdCA9IHZpZXcoXG5cdFx0bGVuc1BhdGgoW1wic3RhY2tzXCIsIFwiRnVuY3Rpb25EaXJlY3RpdmVTdGFja1wiLCBcIlJlc291cmNlc1wiLCBuYW1lXSksXG5cdFx0Y29kZWdlbixcblx0KTtcblx0cmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTGFtYmRhRGF0YVNvdXJjZVByb3BzID0gY3VycnkoXG5cdChvcHRpb25zLCBjb2RlZ2VuLCByZXNvbHZlck5hbWUpID0+IHtcblx0XHRjb25zdCB7IGxhbWJkYVNyY1BhdGggfSA9IG9wdGlvbnM7XG5cdFx0Y29uc3QgcXVlcnlSZXNvbHZlclN0YWNrID0gZ2V0U3RhY2soY29kZWdlbiwgcmVzb2x2ZXJOYW1lKTtcblx0XHRjb25zdCBmaWVsZE5hbWUgPSBxdWVyeVJlc29sdmVyU3RhY2suUHJvcGVydGllcy5GaWVsZE5hbWU7XG5cdFx0Y29uc3QgaW52b2tlck5hbWUgPSBxdWVyeVJlc29sdmVyU3RhY2suRGVwZW5kc09uO1xuXHRcdGNvbnN0IGRhdGFTb3VyY2VOYW1lID0gZ2V0U3RhY2soY29kZWdlbiwgaW52b2tlck5hbWUpLkRlcGVuZHNPbjtcblx0XHRjb25zdCBmdW5jdGlvbk5hbWUgPSBwYXJhbUNhc2UoZmllbGROYW1lKTtcblx0XHRjb25zdCBmdW5jdGlvblNyY1BhdGggPSBqb2luKGxhbWJkYVNyY1BhdGgsIHBhcmFtQ2FzZShmdW5jdGlvbk5hbWUpKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZGF0YVNvdXJjZU5hbWU6IGNhbWVsQ2FzZShkYXRhU291cmNlTmFtZSksXG5cdFx0XHRmdW5jdGlvbk5hbWUsXG5cdFx0XHRmdW5jdGlvblByb3BzOiB7XG5cdFx0XHRcdGhhbmRsZXI6IFwiaW5kZXguaGFuZGxlclwiLFxuXHRcdFx0XHRmdW5jdGlvblNyY1BhdGgsXG5cdFx0XHRcdGZ1bmN0aW9uTmFtZSxcblx0XHRcdH0sXG5cdFx0fTtcblx0fSxcbik7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVMYW1iZGFSZXNvbHZlclByb3AgPSAob3B0aW9ucywgY29kZWdlbiwgZGF0YVNvdXJjZU5hbWUpID0+IHtcblx0Y29uc3Qge1xuXHRcdERlcGVuZHNPbixcblx0XHRQcm9wZXJ0aWVzOiB7IEZpZWxkTmFtZSwgVHlwZU5hbWUgfSxcblx0fSA9IGdldFN0YWNrKGNvZGVnZW4sIGRhdGFTb3VyY2VOYW1lKTtcblx0cmV0dXJuIHtcblx0XHRyZXNvbHZlcjoge1xuXHRcdFx0ZmllbGROYW1lOiBGaWVsZE5hbWUsXG5cdFx0XHR0eXBlTmFtZTogVHlwZU5hbWUsXG5cdFx0XHRyZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBjb2RlZ2VuLnBpcGVsaW5lRnVuY3Rpb25zW2Ake0RlcGVuZHNPbn0ucmVxLnZ0bGBdLFxuXHRcdFx0cmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6XG5cdFx0XHRcdGNvZGVnZW4ucGlwZWxpbmVGdW5jdGlvbnNbYCR7RGVwZW5kc09ufS5yZXMudnRsYF0sXG5cdFx0fSxcblx0fTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRMYW1iZGFEYXRhU291cmNlcyA9IChvcHRpb25zLCBjb2RlZ2VuKSA9PiB7XG5cdGNvbnN0IHN0YWNrTWFwcGluZyA9IHRvUGFpcnMoY29kZWdlbi5zdGFja01hcHBpbmcpO1xuXHRjb25zdCByZXNvbHZlcnMgPSBwaXBlKFxuXHRcdGZpbHRlcihcblx0XHRcdChba2V5LCB2YWx1ZV0pID0+XG5cdFx0XHRcdHZhbHVlID09IFwiRnVuY3Rpb25EaXJlY3RpdmVTdGFja1wiICYmIGtleS5lbmRzV2l0aChcIlJlc29sdmVyXCIpLFxuXHRcdCksXG5cdFx0bWFwKGhlYWQpLFxuXHQpKHN0YWNrTWFwcGluZyk7XG5cdHJldHVybiBtYXAoXG5cdFx0cmVzb2x2ZXJOYW1lID0+ICh7XG5cdFx0XHQuLi5zZWxmLmNyZWF0ZUxhbWJkYURhdGFTb3VyY2VQcm9wcyhvcHRpb25zLCBjb2RlZ2VuLCByZXNvbHZlck5hbWUpLFxuXHRcdFx0Li4uc2VsZi5jcmVhdGVMYW1iZGFSZXNvbHZlclByb3Aob3B0aW9ucywgY29kZWdlbiwgcmVzb2x2ZXJOYW1lKSxcblx0XHR9KSxcblx0XHRyZXNvbHZlcnMsXG5cdCk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTGFtYmRhU3RhY2sgPSBjdXJyeSgoc2NvcGUsIG9wdGlvbnMsIGFwaSwgc3RhY2tQcm9wcykgPT4ge1xuXHRjb25zdCB7XG5cdFx0ZGF0YVNvdXJjZU5hbWUsXG5cdFx0ZGF0YVNvdXJjZVByb3BzLFxuXHRcdGZ1bmN0aW9uTmFtZSxcblx0XHRmdW5jdGlvblByb3BzLFxuXHRcdHJlc29sdmVyLFxuXHR9ID0gc3RhY2tQcm9wcztcblx0Y29uc3QgdGhpc0Z1bmN0aW9uUHJvcHMgPSBnZXRQcm9wcyhcIkZ1bmN0aW9uUHJvcHNcIiwgXCJcIiwgZnVuY3Rpb25Qcm9wcyk7XG5cdGNvbnN0IGxhbWJkYSA9IG5ldyBGdW5jdGlvbihzY29wZSwgZnVuY3Rpb25OYW1lLCB7XG5cdFx0Li4udGhpc0Z1bmN0aW9uUHJvcHMsXG5cdFx0cnVudGltZTogUnVudGltZS5OT0RFSlNfMTJfWCxcblx0XHRjb2RlOiBDb2RlLmZyb21Bc3NldCh0aGlzRnVuY3Rpb25Qcm9wcy5mdW5jdGlvblNyY1BhdGgpLFxuXHR9KTtcblx0Y29uc3QgZGF0YVNvdXJjZSA9IG5ldyBMYW1iZGFEYXRhU291cmNlKHNjb3BlLCBkYXRhU291cmNlTmFtZSwge1xuXHRcdGFwaSxcblx0XHRuYW1lOiBkYXRhU291cmNlTmFtZSxcblx0XHRsYW1iZGFGdW5jdGlvbjogbGFtYmRhLFxuXHR9KTtcblx0Y29uc3QgdGhpc1Jlc29sdmVyUHJvcHMgPSBjcmVhdGVCYXNlUmVzb2x2ZXJQcm9wcyhyZXNvbHZlcik7XG5cdGNvbnN0IHRoaXNSZXNvbHZlciA9IGRhdGFTb3VyY2UuY3JlYXRlUmVzb2x2ZXIodGhpc1Jlc29sdmVyUHJvcHMpO1xuXHRjb25zb2xlLmluZm8odGhpc1Jlc29sdmVyUHJvcHMpO1xuXHRyZXR1cm4ge1xuXHRcdGxhbWJkYSxcblx0XHQvL2RhdGFTb3VyY2UsXG5cdFx0Ly9yZXNvbHZlcjogdGhpc1Jlc29sdmVyLFxuXHR9O1xufSk7XG4iXX0=