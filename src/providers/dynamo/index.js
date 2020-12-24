

import { createDynamoTableProps } from './create-props';
import { createDynamoDataSource } from './create-resources';

export const createDynamoResources = (scope, api, cfSchema) => {
	console.info(0);
	const propsEntries = Object.entries(createDynamoTableProps(cfSchema));

	//console.info(JSON.stringify(propsEntries, null, 2))
	const bob = propsEntries.map(([name,propsList]) => { 

		console.info(name, propsList)
		propsList.map((props) => { 

			createDynamoDataSource(scope, api, props);


		});
	})
	

	// separete out data sources, tables, resolvers
	return {
		stacks: {}, // debatable
		datasources: {},
		tables: {},
		resolvers: {},
	};
};