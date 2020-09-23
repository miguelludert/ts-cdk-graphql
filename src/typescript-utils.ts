import { I_AppSyncGqlSchemaProps, I_DatasourceProvider } from "./interfaces";
import { getProps } from "./datasource-providers/datasource-utils";

export function cast<T>(obj: unknown): T {
	return obj as T;
}

export function getProps<T>(props: I_AppSyncGqlSchemaProps): T {
	return cast<T>({});
}
