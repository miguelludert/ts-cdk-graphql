import { I_DatasourceProvider } from "./interfaces";
import { cast } from "./typescript-utils";
import { DynamoDatasourceProvider } from "../datasource-providers/dynamo";
//import { LambdaDatasourceProvider } from "../datasource-providers/lambda";

// everything exported from this file must be in typescript
export const datasourceProviders = [
	cast<I_DatasourceProvider>(DynamoDatasourceProvider),
	//cast<I_DatasourceProvider>(LambdaDatasourceProvider),
];
export { 
	//LambdaDatasourceProvider, 
	DynamoDatasourceProvider 
};
