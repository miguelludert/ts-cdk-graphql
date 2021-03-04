"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableSetup = exports.graphqlApiSetup = exports.functionSetup = void 0;
const change_case_1 = require("change-case");
const aws_appsync_1 = require("@aws-cdk/aws-appsync");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const path_1 = require("path");
const core_1 = require("@aws-cdk/core");
exports.functionSetup = {
    onProps: (scope, props, context) => {
        const { name, resourceName, typeName, props: { lambdaFunctionCodeDir, lambdaFunctionName, lambdaHandlerName, lambdaRuntime, }, } = context;
        let functionName;
        if (typeof lambdaFunctionName === "function") {
            functionName(resourceName, typeName);
        }
        else {
            functionName = change_case_1.paramCase(resourceName.replace(/lambda-?data-?source$/i, ""));
        }
        const result = {
            functionName: name,
            code: aws_lambda_1.Code.fromAsset(path_1.join(lambdaFunctionCodeDir, functionName)),
            handler: lambdaHandlerName || "index.handler",
            runtime: lambdaRuntime || aws_lambda_1.Runtime.NODEJS_12_X,
            timeout: core_1.Duration.seconds(60),
        };
        return result;
    },
    onConstruct: (scope, construct) => {
        // construct
        // console.info("FUNCTION CONSTRUCT --- FUNCTION CONSTRUCT --- FUNCTION CONSTRUCT --- FUNCTION CONSTRUCT", args);
    },
};
exports.graphqlApiSetup = {
    onProps: (scope, props, context) => {
        const apiProps = {
            name: context.name,
        };
        if (context.props.authorizationConfig) {
            const [defaultAuthorization, ...additionalAuthorizationModes] = context.props.authorizationConfig;
            apiProps.authorizationConfig = {
                defaultAuthorization,
                additionalAuthorizationModes,
            };
        }
        return apiProps;
    },
    onConstruct: () => { },
};
exports.tableSetup = {
    onProps: (scope, props, context) => {
        return {
            name: context.name,
            logConfig: {
                fieldLogLevel: aws_appsync_1.FieldLogLevel.ALL,
            },
        };
    },
    onConstruct: () => { },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1zZXR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvZGVmYXVsdC1zZXR1cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2Q0FBd0M7QUFDeEMsc0RBQXFEO0FBQ3JELG9EQUFvRDtBQUNwRCwrQkFBNEI7QUFDNUIsd0NBQXlDO0FBRTVCLFFBQUEsYUFBYSxHQUFHO0lBQzVCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDbEMsTUFBTSxFQUNMLElBQUksRUFDSixZQUFZLEVBQ1osUUFBUSxFQUNSLEtBQUssRUFBRSxFQUNOLHFCQUFxQixFQUNyQixrQkFBa0IsRUFDbEIsaUJBQWlCLEVBQ2pCLGFBQWEsR0FDYixHQUNELEdBQUcsT0FBTyxDQUFDO1FBRVosSUFBSSxZQUFZLENBQUM7UUFDakIsSUFBSSxPQUFPLGtCQUFrQixLQUFLLFVBQVUsRUFBRTtZQUM3QyxZQUFZLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDTixZQUFZLEdBQUcsdUJBQVMsQ0FDdkIsWUFBWSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUMsQ0FDbEQsQ0FBQztTQUNGO1FBQ0QsTUFBTSxNQUFNLEdBQUc7WUFDZCxZQUFZLEVBQUUsSUFBSTtZQUNsQixJQUFJLEVBQUUsaUJBQUksQ0FBQyxTQUFTLENBQUMsV0FBSSxDQUFDLHFCQUFxQixFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQy9ELE9BQU8sRUFBRSxpQkFBaUIsSUFBSSxlQUFlO1lBQzdDLE9BQU8sRUFBRSxhQUFhLElBQUksb0JBQU8sQ0FBQyxXQUFXO1lBQzdDLE9BQU8sRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztTQUM3QixDQUFDO1FBQ0YsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDO0lBQ0QsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFO1FBQ2pDLFlBQVk7UUFDWixpSEFBaUg7SUFDbEgsQ0FBQztDQUNELENBQUM7QUFFVyxRQUFBLGVBQWUsR0FBRztJQUM5QixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ2xDLE1BQU0sUUFBUSxHQUFHO1lBQ2hCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtTQUNsQixDQUFDO1FBQ0YsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFO1lBQ3RDLE1BQU0sQ0FDTCxvQkFBb0IsRUFDcEIsR0FBRyw0QkFBNEIsQ0FDL0IsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDO1lBQ3RDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRztnQkFDOUIsb0JBQW9CO2dCQUNwQiw0QkFBNEI7YUFDNUIsQ0FBQztTQUNGO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDakIsQ0FBQztJQUNELFdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO0NBQ3JCLENBQUM7QUFFVyxRQUFBLFVBQVUsR0FBRztJQUN6QixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ2xDLE9BQU87WUFDTixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsU0FBUyxFQUFFO2dCQUNWLGFBQWEsRUFBRSwyQkFBYSxDQUFDLEdBQUc7YUFDaEM7U0FDRCxDQUFDO0lBQ0gsQ0FBQztJQUNELFdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO0NBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpZkVsc2UgfSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCB7IHBhcmFtQ2FzZSB9IGZyb20gXCJjaGFuZ2UtY2FzZVwiO1xuaW1wb3J0IHsgRmllbGRMb2dMZXZlbCB9IGZyb20gXCJAYXdzLWNkay9hd3MtYXBwc3luY1wiO1xuaW1wb3J0IHsgUnVudGltZSwgQ29kZSB9IGZyb20gXCJAYXdzLWNkay9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcblxuZXhwb3J0IGNvbnN0IGZ1bmN0aW9uU2V0dXAgPSB7XG5cdG9uUHJvcHM6IChzY29wZSwgcHJvcHMsIGNvbnRleHQpID0+IHtcblx0XHRjb25zdCB7XG5cdFx0XHRuYW1lLFxuXHRcdFx0cmVzb3VyY2VOYW1lLFxuXHRcdFx0dHlwZU5hbWUsXG5cdFx0XHRwcm9wczoge1xuXHRcdFx0XHRsYW1iZGFGdW5jdGlvbkNvZGVEaXIsXG5cdFx0XHRcdGxhbWJkYUZ1bmN0aW9uTmFtZSxcblx0XHRcdFx0bGFtYmRhSGFuZGxlck5hbWUsXG5cdFx0XHRcdGxhbWJkYVJ1bnRpbWUsXG5cdFx0XHR9LFxuXHRcdH0gPSBjb250ZXh0O1xuXG5cdFx0bGV0IGZ1bmN0aW9uTmFtZTtcblx0XHRpZiAodHlwZW9mIGxhbWJkYUZ1bmN0aW9uTmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRmdW5jdGlvbk5hbWUocmVzb3VyY2VOYW1lLCB0eXBlTmFtZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZ1bmN0aW9uTmFtZSA9IHBhcmFtQ2FzZShcblx0XHRcdFx0cmVzb3VyY2VOYW1lLnJlcGxhY2UoL2xhbWJkYS0/ZGF0YS0/c291cmNlJC9pLCBcIlwiKSxcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGNvbnN0IHJlc3VsdCA9IHtcblx0XHRcdGZ1bmN0aW9uTmFtZTogbmFtZSxcblx0XHRcdGNvZGU6IENvZGUuZnJvbUFzc2V0KGpvaW4obGFtYmRhRnVuY3Rpb25Db2RlRGlyLCBmdW5jdGlvbk5hbWUpKSxcblx0XHRcdGhhbmRsZXI6IGxhbWJkYUhhbmRsZXJOYW1lIHx8IFwiaW5kZXguaGFuZGxlclwiLFxuXHRcdFx0cnVudGltZTogbGFtYmRhUnVudGltZSB8fCBSdW50aW1lLk5PREVKU18xMl9YLFxuXHRcdFx0dGltZW91dDogRHVyYXRpb24uc2Vjb25kcyg2MCksXG5cdFx0fTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxuXHRvbkNvbnN0cnVjdDogKHNjb3BlLCBjb25zdHJ1Y3QpID0+IHtcblx0XHQvLyBjb25zdHJ1Y3Rcblx0XHQvLyBjb25zb2xlLmluZm8oXCJGVU5DVElPTiBDT05TVFJVQ1QgLS0tIEZVTkNUSU9OIENPTlNUUlVDVCAtLS0gRlVOQ1RJT04gQ09OU1RSVUNUIC0tLSBGVU5DVElPTiBDT05TVFJVQ1RcIiwgYXJncyk7XG5cdH0sXG59O1xuXG5leHBvcnQgY29uc3QgZ3JhcGhxbEFwaVNldHVwID0ge1xuXHRvblByb3BzOiAoc2NvcGUsIHByb3BzLCBjb250ZXh0KSA9PiB7XG5cdFx0Y29uc3QgYXBpUHJvcHMgPSB7XG5cdFx0XHRuYW1lOiBjb250ZXh0Lm5hbWUsXG5cdFx0fTtcblx0XHRpZiAoY29udGV4dC5wcm9wcy5hdXRob3JpemF0aW9uQ29uZmlnKSB7XG5cdFx0XHRjb25zdCBbXG5cdFx0XHRcdGRlZmF1bHRBdXRob3JpemF0aW9uLFxuXHRcdFx0XHQuLi5hZGRpdGlvbmFsQXV0aG9yaXphdGlvbk1vZGVzXG5cdFx0XHRdID0gY29udGV4dC5wcm9wcy5hdXRob3JpemF0aW9uQ29uZmlnO1xuXHRcdFx0YXBpUHJvcHMuYXV0aG9yaXphdGlvbkNvbmZpZyA9IHtcblx0XHRcdFx0ZGVmYXVsdEF1dGhvcml6YXRpb24sXG5cdFx0XHRcdGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXMsXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRyZXR1cm4gYXBpUHJvcHM7XG5cdH0sXG5cdG9uQ29uc3RydWN0OiAoKSA9PiB7fSxcbn07XG5cbmV4cG9ydCBjb25zdCB0YWJsZVNldHVwID0ge1xuXHRvblByb3BzOiAoc2NvcGUsIHByb3BzLCBjb250ZXh0KSA9PiB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6IGNvbnRleHQubmFtZSxcblx0XHRcdGxvZ0NvbmZpZzoge1xuXHRcdFx0XHRmaWVsZExvZ0xldmVsOiBGaWVsZExvZ0xldmVsLkFMTCxcblx0XHRcdH0sXG5cdFx0fTtcblx0fSxcblx0b25Db25zdHJ1Y3Q6ICgpID0+IHt9LFxufTtcbiJdfQ==