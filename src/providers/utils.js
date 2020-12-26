import { INVOKE_ON_PROPS_ERROR_MESSAGE } from "../constants";
import { join } from "path";
import { curry, toPairs } from "ramda";
import * as self from "./utils";
import { pascalCase } from "change-case";
import { RESOURCE_TYPE_DATASOURCE } from '../constants';

export const findStack = (cfSchema, stackName) => {
	return cfSchema.stacks[stackName];
};

export const filterResourcePairsByType = (resourcePairs, type) => {
	return resourcePairs.filter(([, resource]) => resource.Type === type);
};

export const gatherStacks = (cfSchema) => {
	return toPairs(cfSchema.stackMapping).reduce((acc, [name, stackName]) => {
		if (!acc[stackName]) {
			acc[stackName] = {};
		}
		acc[stackName][name] = cfSchema.stacks[name];
	}, {});
};

export const createConstruct = (scope, props, constructType, resourceName) => {
	const { onProps, onConstruct } = self.gatherConstructSetups(
		props,
		constructType,
		resourceName,
	);
	const context = {
		resourceName,
	};
	const constructProps = self.invokeOnProps(scope, onProps, context);
	const construct = new constructType(scope, resourceName, constructProps);
	self.invokeOnConstruct(scope, construct, onConstruct, context);
	return construct;
};

export function requireConstructSetup(path) {
	let setup = require(path);
	if (!setup) {
		return null;
	} else if (setup.default) {
		return setup.default;
	} else {
		return setup;
	}
}

export function gatherConstructSetups(props, type, resourceName) {
	const setups = [];

	const addSetupFile = (condition, ...paths) => {
		if (condition) {
			const path = join(...paths);
			const setup = self.requireConstructSetup(path);
			if (setup) {
				setups.push(setup);
			}
		}
	};

	addSetupFile(true, __dirname, `../defaults/${type.name}`);
	addSetupFile(props.defaultsDirectory, props.defaultsDirectory, type.name);
	addSetupFile(
		props.overridesDirectory,
		props.overridesDirectory,
		resourceName,
	);

	if (props.defaults && props.defaults[type.name]) {
		setups.push(props.defaults[type.name]);
	}

	if (props.overrides && props.overrides[resourceName]) {
		setups.push(props.overrides[resourceName]);
	}

	return setups.reduce(
		(acc, setup) => {
			if (setup) {
				if (setup.onProps) {
					acc.onProps = [...acc.onProps, setup.onProps];
				}
				if (setup.onConstruct) {
					acc.onConstruct = [...acc.onConstruct, setup.onConstruct];
				}
			}
			return acc;
		},
		{
			onProps: [],
			onConstruct: [],
		},
	);
}

export function invokeOnProps(scope, onProps, context) {
	let props = null;
	onProps.forEach((callback) => {
		props = callback(scope, props, context);
		if (!props) {
			throw INVOKE_ON_PROPS_ERROR_MESSAGE;
		}
	});
	return props;
}

export function invokeOnConstruct(scope, construct, onConstruct, context) {
	onConstruct.forEach((callback) => {
		callback(scope, construct, context);
	});
}

export const createDatasourceProps = curry((propsCallback, datasourceType, cfnSchema) => {
	// get dynamo resources by stack
	console.info(0)
	const result = Object.entries(cfnSchema.stacks).reduce(
		(acc, [stackName, stackCfn]) => {
			const resourcePairs = Object.entries(stackCfn.Resources);
			const datasourcePairs = resourcePairs.find(
				([resourceName, resourceCfn]) => {
					const isDatasource = resourceCfn.Type === RESOURCE_TYPE_DATASOURCE;
					const isDynamo = resourceCfn.Properties.Type === datasourceType;//"AMAZON_DYNAMODB";
					return isDatasource && isDynamo;
				},
			);
			if (datasourcePairs) {
				const [ datasourceName, datasourceCfn ] = datasourcePairs;
				const props = propsCallback({
					stackName,
					resourcePairs,
					datasourceName,
					datasourceCfn,
				});
				acc.push(props);
			}
			return acc;
		},
		[],
	);
	return result;
});

export const dump = (...args) => {
	const dumpJson = (o) => {
		let result;
		try {
			result = JSON.stringify(o, null, 2);
		} catch (e) {
			result = o;
		}
		return `*\t${result}`;
	};
	const toConsole = args.map(dumpJson).join("\n");
	console.info(toConsole);
};
export const addSuffix = curry((suffix, str) =>
	str.endsWith(suffix) ? str : `${str}${suffix}`,
);
export const makeDatasourceName = (name) =>
	addSuffix("Source", pascalCase(name));
export const makeResolverName = addSuffix("-resolver");
export const makeTableName = addSuffix("-table");
export const makeFunctionName = addSuffix("-func");
export const makeGraphqlApiName = addSuffix("-gql-api");
export const makeStackName = addSuffix("-stack");

global.dump = dump;
