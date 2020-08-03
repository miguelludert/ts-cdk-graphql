import * as self from "./lambda";
import {
	curry,
	concat,
	filter,
	head,
	map,
	pipe,
	reduce,
	toPairs,
	values,
	view,
	lensPath,
} from "ramda";
import { getProps, createBaseResolverProps } from "./utils";
import { join } from "path";
import { paramCase, camelCase } from "change-case";
import { Runtime, Function, Code } from "@aws-cdk/aws-lambda";
import { LambdaDataSource } from "@aws-cdk/aws-appsync";

export const getStack = curry((codegen, name) => {
	const result = view(
		lensPath(["stacks", "FunctionDirectiveStack", "Resources", name]),
		codegen,
	);
	return result;
});

export const createLambdaDataSourceProps = curry(
	(options, codegen, resolverName) => {
		const { lambdaSrcPath } = options;
		const queryResolverStack = getStack(codegen, resolverName);
		const fieldName = queryResolverStack.Properties.FieldName;
		const invokerName = queryResolverStack.DependsOn;
		const dataSourceName = getStack(codegen, invokerName).DependsOn;
		const functionName = paramCase(fieldName);
		const functionSrcPath = join(lambdaSrcPath, paramCase(functionName));
		return {
			dataSourceName: camelCase(dataSourceName),
			functionName,
			functionProps: {
				handler: "index.handler",
				functionSrcPath,
				functionName,
			},
		};
	},
);

export const createLambdaResolverProp = (options, codegen, dataSourceName) => {
	const {
		DependsOn,
		Properties: { FieldName, TypeName },
	} = getStack(codegen, dataSourceName);
	return {
		resolver: {
			fieldName: FieldName,
			typeName: TypeName,
			requestMappingTemplate: codegen.pipelineFunctions[`${DependsOn}.req.vtl`],
			responseMappingTemplate:
				codegen.pipelineFunctions[`${DependsOn}.res.vtl`],
		},
	};
};

export const getLambdaDataSources = (options, codegen) => {
	const stackMapping = toPairs(codegen.stackMapping);
	const resolvers = pipe(
		filter(
			([key, value]) =>
				value == "FunctionDirectiveStack" && key.endsWith("Resolver"),
		),
		map(head),
	)(stackMapping);
	return map(
		resolverName => ({
			...self.createLambdaDataSourceProps(options, codegen, resolverName),
			...self.createLambdaResolverProp(options, codegen, resolverName),
		}),
		resolvers,
	);
};

export const createLambdaStack = curry((scope, options, api, stackProps) => {
	const {
		dataSourceName,
		dataSourceProps,
		functionName,
		functionProps,
		resolver,
	} = stackProps;
	const thisFunctionProps = getProps("FunctionProps", "", functionProps);
	const thisResolverProps = createBaseResolverProps(resolver);
	const lambda = new Function(scope, functionName, {
		...thisFunctionProps,
		runtime: Runtime.NODEJS_12_X,
		code: Code.fromAsset(thisFunctionProps.functionSrcPath),
	});
	const dataSource = new LambdaDataSource(scope, dataSourceName, {
		api,
		name: dataSourceName,
		lambdaFunction: lambda,
	});
	const thisResolver = dataSource.createResolver(thisResolverProps);
	return {
		lambda,
		//dataSource,
		//resolver: thisResolver,
	};
});
