import { ifElse } from "ramda";
import { paramCase } from "change-case";
import { FieldLogLevel } from "@aws-cdk/aws-appsync";
import { Runtime, Code } from "@aws-cdk/aws-lambda";
import { join } from "path";
import { Duration } from "@aws-cdk/core";

export const functionSetup = {
	onProps: (scope, props, context) => {
		const {
			name,
			resourceName,
			typeName,
			props: {
				lambdaFunctionCodeDir,
				lambdaFunctionName,
				lambdaHandlerName,
				lambdaRuntime,
			},
		} = context;

		let functionName;
		if (typeof lambdaFunctionName === "function") {
			functionName(resourceName, typeName);
		} else {
			functionName = paramCase(
				resourceName.replace(/lambda-?data-?source$/i, ""),
			);
		}
		const result = {
			functionName: name,
			code: Code.fromAsset(join(lambdaFunctionCodeDir, functionName)),
			handler: lambdaHandlerName || "index.handler",
			runtime: lambdaRuntime || Runtime.NODEJS_12_X,
			timeout: Duration.seconds(60),
		};
		return result;
	},
	onConstruct: (scope, construct) => {
		// construct
		// console.info("FUNCTION CONSTRUCT --- FUNCTION CONSTRUCT --- FUNCTION CONSTRUCT --- FUNCTION CONSTRUCT", args);
	},
};

export const graphqlApiSetup = {
	onProps: (scope, props, context) => {
		const apiProps = {
			name: context.name,
		};
		if (context.props.authorizationConfig) {
			const [
				defaultAuthorization,
				...additionalAuthorizationModes
			] = context.props.authorizationConfig;
			apiProps.authorizationConfig = {
				defaultAuthorization,
				additionalAuthorizationModes,
			};
		}
		return apiProps;
	},
	onConstruct: () => {},
};

export const tableSetup = {
	onProps: (scope, props, context) => {
		return {
			name: context.name,
			logConfig: {
				fieldLogLevel: FieldLogLevel.ALL,
			},
		};
	},
	onConstruct: () => {},
};
