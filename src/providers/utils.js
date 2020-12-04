import { INVOKE_ON_PROPS_ERROR_MESSAGE } from "../constants";
import { join } from "path";
import { toPairs } from "ramda";
import * as self from './utils';

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
		resourceName
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
