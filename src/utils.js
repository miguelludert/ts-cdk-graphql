import DynamoDbDataSourceProps from "./defaults/DynamoDbDataSourceProps.json";
import FunctionProps from "./defaults/FunctionProps.json";
import GraphQLApiProps from "./defaults/GraphQLApiProps.json";
import LambdaDataSourceProps from "./defaults/LambdaDataSourceProps.json";
import TableProps from "./defaults/TableProps.json";
import { MappingTemplate, BaseResolverProps } from "@aws-cdk/aws-appsync";
import { ok } from "assert";
import { is, isNil, isEmpty, not } from "ramda";

const defaults = {
	DynamoDbDataSourceProps: DynamoDbDataSourceProps,
	FunctionProps: FunctionProps,
	GraphQLApiProps: GraphQLApiProps,
	LambdaDataSourceProps: LambdaDataSourceProps,
	TableProps: TableProps,
};

export const getDefault = name => {
	return defaults[name];
};

export const getOverride = name => {
	return null;
};

export const getDefaultNames = name => {
	return Object.keys(defaults);
};

export const getProps = (defaultName, overrideName, value) => {
	const defaultValue = getDefault(defaultName);
	const overrideValue = getDefault(overrideName);
	const toMerge = [defaultValue, value, overrideValue].filter(x => x);
	const result = Object.assign(...toMerge);
	return result;
};

export const createBaseResolverProps = resolverProp => ({
	typeName: resolverProp.typeName,
	fieldName: resolverProp.fieldName,
	requestMappingTemplate: MappingTemplate.fromString(
		resolverProp.requestMappingTemplate,
	),
	responseMappingTemplate: MappingTemplate.fromString(
		resolverProp.responseMappingTemplate,
	),
});
