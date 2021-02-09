/// <reference types="node" />
import { I_AppSyncGqlSchemaProps } from "./interfaces";
import { Construct } from "@aws-cdk/core";
export * from '../providers/utils';
export declare function cast<T>(obj: unknown): T;
export declare function getProps<T>(props: I_AppSyncGqlSchemaProps): T;
export declare const readFileSync: (path: any, encoding: any) => Buffer;
export declare function createConstruct(scope: Construct, props: I_AppSyncGqlSchemaProps, constructType: any, resourceName: string): any;
export declare const naming: (conventions: ((name: string) => string)[], name: any) => any;
