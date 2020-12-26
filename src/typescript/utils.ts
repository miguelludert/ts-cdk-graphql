import { I_AppSyncGqlSchemaProps, I_DatasourceProvider } from "./interfaces";
import { readFileSync as privateReadFileSync } from 'fs';
import { Construct } from "@aws-cdk/core";
import { createConstruct as createConstructJs } from '../providers/utils';

export * from '../providers/utils';

export function cast<T>(obj: unknown): T {
	return obj as T;
}

export function getProps<T>(props: I_AppSyncGqlSchemaProps): T {
	return cast<T>({});
}

// exported seperately for unit testing
export const readFileSync = (path, encoding)  => privateReadFileSync(path, encoding);

export function createConstruct<TConsruct,TProps>(scope : Construct, props : TProps, constructType : any, resourceName : string) { 
	return createConstructJs(scope, props, constructType, resourceName);
}