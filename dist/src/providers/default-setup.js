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
        const { name, resourceName, typeName, props: { lambdaFunctionCodeDir, lambdaFunctionName, lambdaHandlerName, lambdaRuntime } } = context;
        let functionName;
        if (typeof lambdaFunctionName === "function") {
            functionName(resourceName, typeName);
        }
        else {
            functionName = change_case_1.paramCase(resourceName.replace(/lambda-?data-?source$/i, ''));
        }
        const result = {
            functionName: name,
            code: aws_lambda_1.Code.fromAsset(path_1.join(lambdaFunctionCodeDir, functionName)),
            handler: lambdaHandlerName || "index.handler",
            runtime: lambdaRuntime || aws_lambda_1.Runtime.NODEJS_12_X,
            timeout: core_1.Duration.seconds(60)
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
            name: context.name
        };
        if (props && props.authorizationConfig) {
            console.info("AUTH");
            apiProps.authorizationConfig = props.authorizationConfig;
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
                fieldLogLevel: aws_appsync_1.FieldLogLevel.ALL
            }
        };
    },
    onConstruct: () => { },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1zZXR1cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvZGVmYXVsdC1zZXR1cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2Q0FBd0M7QUFDeEMsc0RBQXFEO0FBQ3JELG9EQUFvRDtBQUNwRCwrQkFBNEI7QUFDNUIsd0NBQXlDO0FBRTVCLFFBQUEsYUFBYSxHQUFHO0lBQzVCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDbEMsTUFBTSxFQUNMLElBQUksRUFDSixZQUFZLEVBQ1osUUFBUSxFQUNSLEtBQUssRUFBRyxFQUNQLHFCQUFxQixFQUNyQixrQkFBa0IsRUFDbEIsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixFQUNELEdBQUcsT0FBTyxDQUFDO1FBRVosSUFBSSxZQUFZLENBQUM7UUFDakIsSUFBRyxPQUFPLGtCQUFrQixLQUFLLFVBQVUsRUFBRTtZQUM1QyxZQUFZLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1NBQ3BDO2FBQU07WUFDTixZQUFZLEdBQUcsdUJBQVMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDNUU7UUFDRCxNQUFNLE1BQU0sR0FBRztZQUNkLFlBQVksRUFBRyxJQUFJO1lBQ25CLElBQUksRUFBRyxpQkFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFJLENBQUMscUJBQXFCLEVBQUMsWUFBWSxDQUFDLENBQUM7WUFDL0QsT0FBTyxFQUFHLGlCQUFpQixJQUFJLGVBQWU7WUFDOUMsT0FBTyxFQUFHLGFBQWEsSUFBSSxvQkFBTyxDQUFDLFdBQVc7WUFDOUMsT0FBTyxFQUFHLGVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQzlCLENBQUM7UUFDRixPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7SUFDRCxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUU7UUFFakMsWUFBWTtRQUNaLGlIQUFpSDtJQUVsSCxDQUFDO0NBQ0QsQ0FBQztBQUVXLFFBQUEsZUFBZSxHQUFHO0lBQzlCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDbEMsTUFBTSxRQUFRLEdBQUc7WUFDaEIsSUFBSSxFQUFHLE9BQU8sQ0FBQyxJQUFJO1NBQ25CLENBQUM7UUFFRixJQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsbUJBQW1CLEVBQUU7WUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNwQixRQUFRLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDO1NBQ3pEO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDakIsQ0FBQztJQUNELFdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO0NBQ3JCLENBQUM7QUFHVyxRQUFBLFVBQVUsR0FBRztJQUN6QixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ2xDLE9BQU87WUFDTixJQUFJLEVBQUcsT0FBTyxDQUFDLElBQUk7WUFDbkIsU0FBUyxFQUFHO2dCQUNYLGFBQWEsRUFBRywyQkFBYSxDQUFDLEdBQUc7YUFDakM7U0FDRCxDQUFDO0lBQ0gsQ0FBQztJQUNELFdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDO0NBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpZkVsc2UgfSBmcm9tICdyYW1kYSc7XG5pbXBvcnQgeyBwYXJhbUNhc2UgfSBmcm9tICdjaGFuZ2UtY2FzZSc7XG5pbXBvcnQgeyBGaWVsZExvZ0xldmVsIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1hcHBzeW5jXCI7XG5pbXBvcnQgeyBSdW50aW1lLCBDb2RlIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cbmV4cG9ydCBjb25zdCBmdW5jdGlvblNldHVwID0ge1xuXHRvblByb3BzOiAoc2NvcGUsIHByb3BzLCBjb250ZXh0KSA9PiB7XG5cdFx0Y29uc3QgeyAgXG5cdFx0XHRuYW1lLFxuXHRcdFx0cmVzb3VyY2VOYW1lLCBcblx0XHRcdHR5cGVOYW1lLFxuXHRcdFx0cHJvcHMgOiB7XG5cdFx0XHRcdGxhbWJkYUZ1bmN0aW9uQ29kZURpcixcblx0XHRcdFx0bGFtYmRhRnVuY3Rpb25OYW1lLFxuXHRcdFx0XHRsYW1iZGFIYW5kbGVyTmFtZSxcblx0XHRcdFx0bGFtYmRhUnVudGltZVxuXHRcdFx0fSBcblx0XHR9ID0gY29udGV4dDtcblxuXHRcdGxldCBmdW5jdGlvbk5hbWU7XG5cdFx0aWYodHlwZW9mIGxhbWJkYUZ1bmN0aW9uTmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRmdW5jdGlvbk5hbWUocmVzb3VyY2VOYW1lLCB0eXBlTmFtZSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZnVuY3Rpb25OYW1lID0gcGFyYW1DYXNlKHJlc291cmNlTmFtZS5yZXBsYWNlKC9sYW1iZGEtP2RhdGEtP3NvdXJjZSQvaSwnJykpO1xuXHRcdH1cblx0XHRjb25zdCByZXN1bHQgPSB7XG5cdFx0XHRmdW5jdGlvbk5hbWUgOiBuYW1lLFxuXHRcdFx0Y29kZSA6IENvZGUuZnJvbUFzc2V0KGpvaW4obGFtYmRhRnVuY3Rpb25Db2RlRGlyLGZ1bmN0aW9uTmFtZSkpLFxuXHRcdFx0aGFuZGxlciA6IGxhbWJkYUhhbmRsZXJOYW1lIHx8IFwiaW5kZXguaGFuZGxlclwiLFxuXHRcdFx0cnVudGltZSA6IGxhbWJkYVJ1bnRpbWUgfHwgUnVudGltZS5OT0RFSlNfMTJfWCxcblx0XHRcdHRpbWVvdXQgOiBEdXJhdGlvbi5zZWNvbmRzKDYwKVxuXHRcdH07XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblx0b25Db25zdHJ1Y3Q6IChzY29wZSwgY29uc3RydWN0KSA9PiB7XG5cblx0XHQvLyBjb25zdHJ1Y3Rcblx0XHQvLyBjb25zb2xlLmluZm8oXCJGVU5DVElPTiBDT05TVFJVQ1QgLS0tIEZVTkNUSU9OIENPTlNUUlVDVCAtLS0gRlVOQ1RJT04gQ09OU1RSVUNUIC0tLSBGVU5DVElPTiBDT05TVFJVQ1RcIiwgYXJncyk7XG5cblx0fSxcbn07XG5cbmV4cG9ydCBjb25zdCBncmFwaHFsQXBpU2V0dXAgPSB7XG5cdG9uUHJvcHM6IChzY29wZSwgcHJvcHMsIGNvbnRleHQpID0+IHtcblx0XHRjb25zdCBhcGlQcm9wcyA9IHtcblx0XHRcdG5hbWUgOiBjb250ZXh0Lm5hbWVcblx0XHR9O1xuXG5cdFx0aWYocHJvcHMgJiYgcHJvcHMuYXV0aG9yaXphdGlvbkNvbmZpZykge1xuXHRcdFx0Y29uc29sZS5pbmZvKFwiQVVUSFwiKVxuXHRcdFx0YXBpUHJvcHMuYXV0aG9yaXphdGlvbkNvbmZpZyA9IHByb3BzLmF1dGhvcml6YXRpb25Db25maWc7XG5cdFx0fVxuXHRcdHJldHVybiBhcGlQcm9wcztcblx0fSxcblx0b25Db25zdHJ1Y3Q6ICgpID0+IHt9LFxufTtcblxuXG5leHBvcnQgY29uc3QgdGFibGVTZXR1cCA9IHtcblx0b25Qcm9wczogKHNjb3BlLCBwcm9wcywgY29udGV4dCkgPT4ge1xuXHRcdHJldHVybiB7XG5cdFx0XHRuYW1lIDogY29udGV4dC5uYW1lLFxuXHRcdFx0bG9nQ29uZmlnIDoge1xuXHRcdFx0XHRmaWVsZExvZ0xldmVsIDogRmllbGRMb2dMZXZlbC5BTExcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXHRvbkNvbnN0cnVjdDogKCkgPT4ge30sXG59OyJdfQ==