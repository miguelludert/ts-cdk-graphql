export const createResources = () => {
	const dynamoStacks = filterDataSourcesOfType(cfSchema, AMAZON_DYNAMODB);
	// if these are already organized as stacks maybe we export them as stacks after all?

	// separete out data sources, tables, resolvers
	return {
		stacks: {}, // debatable
		datasources: {},
		tables: {},
		resolvers: {},
	};
};
