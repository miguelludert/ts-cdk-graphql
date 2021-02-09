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
exports.createLambdaResources = exports.createLambdaDataSource = void 0;
const utils_1 = require("./utils");
const ramda_1 = require("ramda");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const constants_1 = require("../constants");
const self = __importStar(require("./lambda"));
const createLambdaDataSource = (scope, props, api, cfSchema) => {
    const stackName = "FunctionDirectiveStack";
    const resourcePairs = Object.entries(cfSchema.stacks.FunctionDirectiveStack.Resources);
    const lambdaDataSources = resourcePairs
        .filter(([name, cfn]) => cfn.Properties.Type === constants_1.DATASOURCE_TYPE_LAMBDA)
        .map(([name, cfn]) => ({
        stackName,
        datasourceName: name,
        datasourceCfn: cfn,
    }));
    const result = lambdaDataSources.map(self.createLambdaResources(scope, props, api));
    return result;
};
exports.createLambdaDataSource = createLambdaDataSource;
exports.createLambdaResources = ramda_1.curry((scope, props, api, { stackName, resourcePairs, datasourceName, datasourceCfn }) => {
    if (!props.lambdaFunctionCodeDir) {
        throw new Error("Prop `lambdaFunctionCodeDir` not set.");
    }
    const lambda = utils_1.createConstruct(scope, props, aws_lambda_1.Function, datasourceName);
    const datasource = api.addLambdaDataSource(datasourceName, lambda, {
        name: datasourceName,
    });
    return {
        lambda,
        datasourceName,
        stackName,
        datasource,
        datasourceCfn,
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy9sYW1iZGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE0RDtBQUU1RCxpQ0FBd0Q7QUFDeEQsb0RBQThEO0FBQzlELDRDQUdzQjtBQUV0QiwrQ0FBaUM7QUFFMUIsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFO0lBQ3JFLE1BQU0sU0FBUyxHQUFHLHdCQUF3QixDQUFDO0lBQzNDLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQ25DLFFBQVEsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUNoRCxDQUFDO0lBQ0YsTUFBTSxpQkFBaUIsR0FBRyxhQUFhO1NBQ3JDLE1BQU0sQ0FDTixDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FDZixHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxrQ0FBc0IsQ0FDL0M7U0FDQSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN0QixTQUFTO1FBQ1QsY0FBYyxFQUFHLElBQUk7UUFDckIsYUFBYSxFQUFHLEdBQUc7S0FDbkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxNQUFNLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwRixPQUFPLE1BQU0sQ0FBQztBQUNmLENBQUMsQ0FBQztBQWpCVyxRQUFBLHNCQUFzQiwwQkFpQmpDO0FBRVcsUUFBQSxxQkFBcUIsR0FBRyxhQUFLLENBQ3pDLENBQ0MsS0FBSyxFQUNMLEtBQUssRUFDTCxHQUFHLEVBQ0gsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsRUFDMUQsRUFBRTtJQUNILElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUU7UUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0tBQ3pEO0lBQ0QsTUFBTSxNQUFNLEdBQUcsdUJBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLHFCQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDdkUsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUU7UUFDbEUsSUFBSSxFQUFFLGNBQWM7S0FDcEIsQ0FBQyxDQUFDO0lBQ0gsT0FBTztRQUNOLE1BQU07UUFDTixjQUFjO1FBQ2QsU0FBUztRQUNULFVBQVU7UUFDVixhQUFhO0tBQ2IsQ0FBQztBQUNILENBQUMsQ0FDRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0RGF0YXNvdXJjZUNmbiwgY3JlYXRlQ29uc3RydWN0IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IG5hbWluZyB9IGZyb20gXCIuLi90eXBlc2NyaXB0L3V0aWxzXCI7XG5pbXBvcnQgeyBjdXJyeSwgZGVmYXVsdFRvLCBjdXJyeSwgdmFsdWVzIH0gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgeyBGdW5jdGlvbiwgUnVudGltZSwgQ29kZSB9IGZyb20gXCJAYXdzLWNkay9hd3MtbGFtYmRhXCI7XG5pbXBvcnQge1xuXHRSRVNPVVJDRV9UWVBFX0ZVTkNUSU9OX0NPTkZJRyxcblx0REFUQVNPVVJDRV9UWVBFX0xBTUJEQSxcbn0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgcGFyYW1DYXNlLCBwYXNjYWxDYXNlIH0gZnJvbSBcImNoYW5nZS1jYXNlXCI7XG5pbXBvcnQgKiBhcyBzZWxmIGZyb20gXCIuL2xhbWJkYVwiO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlTGFtYmRhRGF0YVNvdXJjZSA9IChzY29wZSwgcHJvcHMsIGFwaSwgY2ZTY2hlbWEpID0+IHtcblx0Y29uc3Qgc3RhY2tOYW1lID0gXCJGdW5jdGlvbkRpcmVjdGl2ZVN0YWNrXCI7XG5cdGNvbnN0IHJlc291cmNlUGFpcnMgPSBPYmplY3QuZW50cmllcyhcblx0XHRjZlNjaGVtYS5zdGFja3MuRnVuY3Rpb25EaXJlY3RpdmVTdGFjay5SZXNvdXJjZXMsXG5cdCk7XG5cdGNvbnN0IGxhbWJkYURhdGFTb3VyY2VzID0gcmVzb3VyY2VQYWlyc1xuXHRcdC5maWx0ZXIoXG5cdFx0XHQoW25hbWUsIGNmbl0pID0+XG5cdFx0XHRcdGNmbi5Qcm9wZXJ0aWVzLlR5cGUgPT09IERBVEFTT1VSQ0VfVFlQRV9MQU1CREEsXG5cdFx0KVxuXHRcdC5tYXAoKFtuYW1lLCBjZm5dKSA9PiAoe1xuXHRcdFx0c3RhY2tOYW1lLFxuXHRcdFx0ZGF0YXNvdXJjZU5hbWUgOiBuYW1lLFxuXHRcdFx0ZGF0YXNvdXJjZUNmbiA6IGNmbixcblx0XHR9KSk7XG5cdGNvbnN0IHJlc3VsdCA9IGxhbWJkYURhdGFTb3VyY2VzLm1hcChzZWxmLmNyZWF0ZUxhbWJkYVJlc291cmNlcyhzY29wZSwgcHJvcHMsIGFwaSkpO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxhbWJkYVJlc291cmNlcyA9IGN1cnJ5KFxuXHQoXG5cdFx0c2NvcGUsXG5cdFx0cHJvcHMsXG5cdFx0YXBpLFxuXHRcdHsgc3RhY2tOYW1lLCByZXNvdXJjZVBhaXJzLCBkYXRhc291cmNlTmFtZSwgZGF0YXNvdXJjZUNmbiB9LFxuXHQpID0+IHtcblx0XHRpZiAoIXByb3BzLmxhbWJkYUZ1bmN0aW9uQ29kZURpcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUHJvcCBgbGFtYmRhRnVuY3Rpb25Db2RlRGlyYCBub3Qgc2V0LlwiKTtcblx0XHR9XG5cdFx0Y29uc3QgbGFtYmRhID0gY3JlYXRlQ29uc3RydWN0KHNjb3BlLCBwcm9wcywgRnVuY3Rpb24sIGRhdGFzb3VyY2VOYW1lKTtcblx0XHRjb25zdCBkYXRhc291cmNlID0gYXBpLmFkZExhbWJkYURhdGFTb3VyY2UoZGF0YXNvdXJjZU5hbWUsIGxhbWJkYSwge1xuXHRcdFx0bmFtZTogZGF0YXNvdXJjZU5hbWUsXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGxhbWJkYSxcblx0XHRcdGRhdGFzb3VyY2VOYW1lLFxuXHRcdFx0c3RhY2tOYW1lLFxuXHRcdFx0ZGF0YXNvdXJjZSxcblx0XHRcdGRhdGFzb3VyY2VDZm4sXG5cdFx0fTtcblx0fSxcbik7XG4iXX0=