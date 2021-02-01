import { I_AppSyncGqlSchemaProps, I_CreateConstructContext } from "./interfaces";
import { readFileSync as privateReadFileSync } from 'fs';
import { Construct } from "@aws-cdk/core";
import { createConstruct as createConstructJs } from '../providers/utils';
import { string1To255 } from "aws-sdk/clients/customerprofiles";

export * from '../providers/utils';

export function cast<T>(obj: unknown): T {
	return obj as T;
}

export function getProps<T>(props: I_AppSyncGqlSchemaProps): T {
	return cast<T>({});
}

// exported seperately for unit testing
export const readFileSync = (path, encoding)  => privateReadFileSync(path, encoding);

export function createConstruct(scope : Construct, props : I_AppSyncGqlSchemaProps, constructType : any, resourceName : string) { 
	return createConstructJs(scope, props, constructType, resourceName);
}

export const naming = (conventions : ((name : string) => string)[], name) => {
	const result = conventions.reduce((acc,conventionCallback) => { 
		const isCallback = typeof conventionCallback === 'function';
		const result = isCallback ? conventionCallback(acc) : acc;
		return result;
	}, name);
	console.info(result);
	return result;
}