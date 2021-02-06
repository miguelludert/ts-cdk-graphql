import { MappingTemplate, Resolver } from "@aws-cdk/aws-appsync";
import {
	curry,
	filter,
	groupBy,
	join,
	lensPath,
	map,
	toPairs,
	pipe,
	prop,
	view,
} from "ramda";
import {
	RESOURCE_TYPE_RESOLVER,
	RESOURCE_TYPE_FUNCTION_CONFIG,
} from "../constants";
import { createConstruct, filterResourcePairsByType, info } from "./utils";
import * as self from "./functions";

export const createResolversAndFunctionsFromSchema = (
	scope,
	props,
	api,
	cfSchema,
	resources,
) => {
	info("functions.createResolversAndFunctionsFromSchema");
	const stackResources = Object.values(cfSchema.stacks);
	const results = stackResources.map(
		self.createResolversAndFunctionsFromStack(
			scope,
			props,
			api,
			cfSchema,
			resources,
		),
	);
	return results;
};

export const createResolversAndFunctionsFromStack = curry(
	(scope, props, api, cfSchema, datasources, stack) => {
		info("functions.createResolversAndFunctionsFromStack");
		const resourcePairs = toPairs(stack.Resources);
		const {
			[RESOURCE_TYPE_RESOLVER]: resolverPairs,
			[RESOURCE_TYPE_FUNCTION_CONFIG]: funcPairs,
		} = groupBy(([, resource]) => resource.Type, resourcePairs);
		const funcs = map(
			self.createFunctionsFromResource(
				scope,
				props,
				api,
				cfSchema,
				datasources,
			),
			funcPairs || [],
		);
		const pipelineResolverPairs = filter(
			([, cfn]) => cfn.Properties.Kind === "PIPELINE",
			resolverPairs || [],
		);
		const regularResolverPairs = filter(
			([, cfn]) => cfn.Properties.Kind !== "PIPELINE",
			resolverPairs || [],
		);
		const resolvers = map(
			self.createResolversFromResource(
				scope,
				props,
				api,
				cfSchema,
				datasources,
			),
			regularResolverPairs || [],
		);
		const pipelineResolvers = map(
			self.createPipelineResolversFromResource(
				scope,
				props,
				api,
				cfSchema,
				datasources,
				funcs,
			),
			pipelineResolverPairs || [],
		);
		return {
			funcs,
			resolvers,
			//pipelineResolvers
		};
	},
);

export const createResolversFromResource = curry(
	(scope, props, api, cfSchema, datasources, [resolverName, resolverCfn]) => {
		info("functions.createResolversFromResource");
		const datasourceName = getDataSourceName(resolverCfn);
		if (!datasourceName) {
			return;
		}
		const { datasource } = datasources.find(
			(f) => f && f.datasourceName == datasourceName,
		);
		const typeName = self.getTypeName(resolverCfn);
		const fieldName = self.getFieldName(resolverCfn);
		const requestMappingTemplateName = self.getRequestResolverName(resolverCfn);
		const responseMappingTemplateName = self.getResponseResolverName(
			resolverCfn,
		);
		const resolverProps = {
			fieldName,
			typeName,
			requestMappingTemplate: MappingTemplate.fromString(
				cfSchema.resolvers[requestMappingTemplateName],
			),
			responseMappingTemplate: MappingTemplate.fromString(
				cfSchema.resolvers[responseMappingTemplateName],
			),
		};
		const resolver = datasource.createResolver(resolverProps);
		return;
		{
			resolverName, resolver, resolverProps, resolverCfn;
		}
	},
);

export const createPipelineResolversFromResource = curry(
	(
		scope,
		props,
		api,
		cfSchema,
		datasources,
		funcs,
		[resolverName, resolverCfn],
	) => {
		info("functions.createPipelineResolversFromResource");
		const funcName = resolverCfn.DependsOn;
		const item = funcs.find((f) => f.funcName === funcName);
		const { datasource } = item;
		//const pipelineConfig = [func];
		const typeName = self.getTypeName(resolverCfn);
		const fieldName = self.getFieldName(resolverCfn);
		const requestMappingTemplateName = self.getRequestResolverName(resolverCfn);
		const responseMappingTemplateName = self.getResponseResolverName(
			resolverCfn,
		);
		const resolverProps = {
			api,
			fieldName,
			typeName,
			// requestMappingTemplate: MappingTemplate.fromString(
			// 	cfSchema.resolvers[requestMappingTemplateName],
			// ),
			// responseMappingTemplate: MappingTemplate.fromString(
			// 	cfSchema.resolvers[responseMappingTemplateName],
			// ),
			//pipelineConfig,
		};
		// console.info("GIMME", {resolverName, fieldName, typeName, requestMappingTemplateName, responseMappingTemplateName, func : func.constructor, funcName});
		// const resolver = new Resolver(scope, resolverName, resolverProps);

		const resolver = datasource.createResolver(resolverProps);
		return {
			resolverName,
			resolver,
			resolverProps,
			resolverCfn,
		};
	},
);

export const createFunctionsFromResource = curry(
	(scope, props, api, cfSchema, datasources, [funcName, funcCfn]) => {
		info("functions.createFunctionsFromResource", funcCfn);

		const datasourceName = funcCfn.Properties.DataSourceName;
		if (!datasourceName) {
			return;
		}
		const { datasource } = datasources.find(
			(f) => f && f.datasourceName == datasourceName,
		);
		if (!datasource) {
			throw new Error(`Datasource '${datasourceName}' not found`);
		}
		const requestMappingTemplateName = `${funcName}.req.vtl`;
		const responseMappingTemplateName = `${funcName}.res.vtl`;
		const funcProps = {
			name: funcName + "uuuuu",
			description: `${funcName} Lambda Function`,
			requestMappingTemplate: MappingTemplate.fromString(
				cfSchema.pipelineFunctions[requestMappingTemplateName],
			),
			responseMappingTemplate: MappingTemplate.fromString(
				cfSchema.pipelineFunctions[responseMappingTemplateName],
			),
		};
		//const func = datasource.createFunction(funcProps);
		return {
			datasource,
			datasourceName,
			funcName,
			//func,
			funcProps,
		};
	},
);

export const getDataSourceName = view(
	lensPath(["Properties", "DataSourceName", "Fn::GetAtt", 0]),
);
export const getFieldName = view(lensPath(["Properties", "FieldName"]));
export const getTypeName = view(lensPath(["Properties", "TypeName"]));
export const getRequestResolverName = (resource) =>
	join(
		".",
		view(
			lensPath([
				"Properties",
				"RequestMappingTemplateS3Location",
				"Fn::Sub",
				1,
				"ResolverFileName",
				"Fn::Join",
				1,
			]),
			resource,
		),
	);

export const getResponseResolverName = (resource) =>
	join(
		".",
		view(
			lensPath([
				"Properties",
				"ResponseMappingTemplateS3Location",
				"Fn::Sub",
				1,
				"ResolverFileName",
				"Fn::Join",
				1,
			]),
			resource,
		),
	);
