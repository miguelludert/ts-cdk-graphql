import { INVOKE_ON_PROPS_ERROR_MESSAGE } from "../constants";
import { join } from "path";
import { curry, toPairs, pipe } from "ramda";
import * as self from "./utils";
import { pascalCase, camelCase, paramCase } from "change-case";
import { RESOURCE_TYPE_DATASOURCE } from "../constants";
import * as defaultSetup from "./default-setup";
import { SyncUtils } from "graphql-transformer-core";

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
	info("createConstruct");
	const { baseName, onProps, onConstruct } = self.gatherConstructSetups(
		props,
		constructType,
	);
	const name =
		typeof props.namingConvention === "function"
			? props.namingConvention(resourceName, baseName)
			: paramCase(`${resourceName}-${baseName}`);

	const context = {
		props,
		name,
		baseName,
		resourceName,
	};
	const constructProps = self.invokeOnProps(scope, onProps, context);
	const construct = new constructType(scope, name, constructProps);
	self.invokeOnConstruct(scope, construct, onConstruct, context);
	return construct;
};

export function gatherConstructSetups(props, type) {
	const { name: typeName } = type;
	const setupName = `${camelCase(typeName)}Setup`;
	const setup = defaultSetup[setupName];
	const baseName = setup.baseName || typeName;
	const setups = [setup];

	if (props.defaults && props.defaults[typeName]) {
		setups.push(props.defaults[typeName]);
	}

	// if (props.overrides && props.overrides[resourceName]) {
	// 	setups.push(props.overrides[resourceName]);
	// }

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
			baseName,
			onProps: [],
			onConstruct: [],
		},
	);
}

export function invokeOnProps(scope, onProps, context) {
	info("invokeOnProps");
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
	info("invokeOnConstruct");
	onConstruct.forEach((callback) => {
		callback(scope, construct, context);
	});
}

export const getDatasourceCfn = curry((datasourceType, cfnSchema) => {
	// get dynamo resources by stack
	const result = Object.entries(cfnSchema.stacks).reduce(
		(acc, [stackName, stackCfn]) => {
			const resourcePairs = Object.entries(stackCfn.Resources);
			const datasourcePairs = resourcePairs.find(
				([resourceName, resourceCfn]) => {
					const isDatasource = resourceCfn.Type === RESOURCE_TYPE_DATASOURCE;
					const isDynamo = resourceCfn.Properties.Type === datasourceType;
					return isDatasource && isDynamo;
				},
			);
			if (datasourcePairs) {
				const [datasourceName, datasourceCfn] = datasourcePairs;
				acc.push({
					stackName,
					resourcePairs,
					datasourceName,
					datasourceCfn,
				});
			}
			return acc;
		},
		[],
	);
	return result;
});

export const info = (...args) => console.info(...args);

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

global.dump = dump;
