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
import { join } from "path";
import { paramCase } from "change-case";
import { Runtime } from "@aws-cdk/aws-lambda";

export const getStack = curry((codegen, name) =>
	view(lensPath(["stacks", "FunctionDirectiveStack", name]), codegen),
);

export const createLambdaDataSourceProps = curry(
	(options, codegen, resolverName) => {
		const invokerName = getStack(codegen, resolverName).DependsOn;
		const dataSourceName = getStack(codegen, resolverName).DependsOn;

		const { prefix, lambdaSrcPath } = options;
		const lambdaName = concat(prefix || "", paramCase(dataSourceName));
		return {
			dataSourceName: lambdaName,
			dataSourceProps: {
				name: lambdaName,
			},
			functionProps: {
				runtime: "NODEJS_12_X",
				handler: "index.handler",
				functionSrcPath: join(lambdaSrcPath, paramCase(dataSourceName)),
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
