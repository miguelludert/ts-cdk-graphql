import DynamoDbDataSourceProps from "./defaults/DynamoDbDataSourceProps.json";
import FunctionProps from "./defaults/FunctionProps.json";
import GraphQLApiProps from "./defaults/GraphQLApiProps.json";
import LambdaDataSourceProps from "./defaults/LambdaDataSourceProps.json";
import TableProps from "./defaults/TableProps.json";

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
	const toMerge = [
		getDefault(defaultName),
		value,
		getOverride(overrideName),
	].filter(x => x);
	return Object.assign(...toMerge);
};
