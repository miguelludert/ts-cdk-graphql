import { I_DatasourceProvider } from "../interfaces";
import { cast } from "../typescript-utils";
import { DynamoDatasourceProvider } from "./dynamo-datasource-provider";
import { LambdaDatasourceProvider } from "./lambda-datasource-provider";

// everything exported from this file must be in typescript
export const datasourceProviders = [
	cast<I_DatasourceProvider>(DynamoDatasourceProvider),
	cast<I_DatasourceProvider>(LambdaDatasourceProvider),
];
export { LambdaDatasourceProvider, DynamoDatasourceProvider };
