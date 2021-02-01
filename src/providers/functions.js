import { MappingTemplate } from "@aws-cdk/aws-appsync";
import { curry, groupBy, join, lensPath, map, toPairs, pipe, prop, view } from "ramda";
import { RESOURCE_TYPE_RESOLVER, RESOURCE_TYPE_FUNCTION_CONFIG } from "../constants";
import { filterResourcePairsByType } from "./utils";
import * as self from "./functions";

export const createResolversAndFunctionsFromSchema = (cfSchema, resources) => {
	const stackResources = Object.values(cfSchema.stacks);
	const results = stackResources.map(
		self.createResolversAndFunctionsFromStack(cfSchema, resources),
	);
	return results;
};


export const createResolversAndFunctionsFromStack = curry((cfSchema, datasources, stack) => {
	const resourcePairs = toPairs(stack.Resources);
	const bob = groupBy(([,resource]) => resource.Type, resourcePairs);
	const {
		[RESOURCE_TYPE_RESOLVER] : resolverPairs,
		[RESOURCE_TYPE_FUNCTION_CONFIG] : funcPairs
	} = bob;
	const funcs = map(self.createFunctionsFromResource(cfSchema, datasources),  []); //funcPairs ||
	const resolvers = map(self.createResolversFromResource(cfSchema, funcs, datasources),  []); // resolverPairs ||
	return {
		funcs,
		resolvers
	};;
});

export const createResolversFromResource = curry(
	(cfSchema, funcs, datasources, [resolverName, resolverCfn]) => {
		const datasourceName = getDataSourceName(resolverCfn);
		if(!datasourceName) {
			return;
		}
		const { datasource } = datasources.find(
			(f) => f && f.datasourceName == datasourceName,
		);
		const typeName = self.getTypeName(resolverCfn),
		const fieldName = self.getFieldName(resolverCfn),
		const requestMappingTemplateName = self.getRequestResolverName(resolverCfn),
		const responseMappingTemplateName = self.getResponseResolverName(resolverCfn),
		const resolverProps = {
			fieldName,
			typeName,
			requestMappingTemplate: MappingTemplate.fromString(cfSchema.resolvers[requestMappingTemplateName]),
			responseMappingTemplate: MappingTemplate.fromString(cfSchema.resolvers[responseMappingTemplateName]),
		};
		const resolver = datasource.createResolver(resolverProps);
		return 
		{
			resolverName,
			resolver,
			resolverProps
		};
	},
);

export const createFunctionsFromResource = curry(
	(cfSchema, datasources, [funcName, funcCfn]) => {
		const datasourceName = funcCfn.Properties.DataSourceName;
		if(!datasourceName) {
			return;
		}
		const { datasource } = datasources.find(
			(f) => f && f.datasourceName == datasourceName,
		);
		if(!datasource) { 
			throw new Error(`Datasource '${datasourceName}' not found`)
		}

		const requestMappingTemplateName = self.getRequestResolverName(funcCfn);
		const responseMappingTemplateName = self.getResponseResolverName(funcCfn);
		const name = funcCfn.Properties.Name;
		const funcProps = {
			name,
			description : `Lambda datasource`,
			requestMappingTemplate: MappingTemplate.fromString(cfSchema.pipelineFunctions[requestMappingTemplateName]),
			responseMappingTemplate: MappingTemplate.fromString(cfSchema.pipelineFunctions[responseMappingTemplateName]),
		};
		const func = datasource.createFunction(funcProps);
		return {
			funcName,
			func, 
			funcProps};
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

