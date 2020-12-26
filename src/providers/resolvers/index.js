import { MappingTemplate } from "@aws-cdk/aws-appsync";
import {AppsyncFunction} from '@aws-cdk/aws-appsync';
import { curry, join, lensPath, toPairs, pipe, prop, view } from "ramda";
import { RESOURCE_TYPE_RESOLVER } from "../../constants";
import { filterResourcePairsByType } from "../utils";
import * as self from "./index";

export const createResolversFromSchema = (cfSchema, resources) => {
	const stackResources = Object.values(cfSchema.stacks);
	const resolvers = stackResources.map(
		self.createResolversFromStack(cfSchema, resources),
	);
	return resolvers;
};

export const createResolversFromStack = curry((cfSchema, datasources, stack) => {
	const resourcePairs = toPairs(stack.Resources);
	const resolverPairs = filterResourcePairsByType(
		resourcePairs,
		RESOURCE_TYPE_RESOLVER,
	);
	const resolvers = resolverPairs.map(createResolverFromResource(cfSchema, datasources));
	return resolvers;
});

export const createResolverFromResource = curry(
	(cfSchema, datasources, [resolverName, resolverCfn]) => {
		const datasourceName = getDataSourceName(resolverCfn);
		const { datasource } = datasources.find(
			(f) => f.datasourceName == datasourceName,
		);
		const typeName = self.getTypeName(resolverCfn),
		const fieldName = self.getFieldName(resolverCfn),
		const requestMappingTemplateName = self.getRequestResolverName(resolverCfn),
		const responseMappingTemplateName = self.getResponseResolverName(resolverCfn),
		const funcProps = {
			name : fieldName,
			description : `${typeName}.${fieldName}`,
			requestMappingTemplate: MappingTemplate.fromString(cfSchema.resolvers[requestMappingTemplateName]),
			responseMappingTemplate: MappingTemplate.fromString(cfSchema.resolvers[responseMappingTemplateName]),
		};
		const func = datasource.createFunction(funcProps);
		return {func, funcProps};
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

