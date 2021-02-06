import { getDatasourceCfn, createConstruct } from "./utils";
import { naming } from "../typescript/utils";
import { curry, defaultTo, curry, values } from "ramda";
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda";
import {
	RESOURCE_TYPE_FUNCTION_CONFIG,
	DATASOURCE_TYPE_LAMBDA,
} from "../constants";
import { paramCase, pascalCase } from "change-case";
import * as self from "./lambda";

export const createLambdaDataSource = (scope, props, api, cfSchema) => {
	const stackName = "FunctionDirectiveStack";
	const resourcePairs = Object.entries(
		cfSchema.stacks.FunctionDirectiveStack.Resources,
	);
	const lambdaDataSources = resourcePairs
		.filter(
			([name, cfn]) =>
				cfn.Properties.Type === DATASOURCE_TYPE_LAMBDA,
		)
		.map(([name, cfn]) => ({
			stackName,
			datasourceName : name,
			datasourceCfn : cfn,
		}));
	const result = lambdaDataSources.map(self.createLambdaResources(scope, props, api));
	return result;
};

export const createLambdaResources = curry(
	(
		scope,
		props,
		api,
		{ stackName, resourcePairs, datasourceName, datasourceCfn },
	) => {
		if (!props.lambdaFunctionCodeDir) {
			throw new Error("Prop `lambdaFunctionCodeDir` not set.");
		}
		const lambda = createConstruct(scope, props, Function, datasourceName);
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
	},
);
