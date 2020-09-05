function example() {
	const appSyncSchemaStack = new AppSyncSchemaStack(this, "stack-name", {
		environment: {
			SOME_VAR: "SOME_VALUE",
		},
		context: {
			// only used if we want to pass something to our overrides
			SOME_VAR: "SOME_VALUE",
		},
		prefix: "prefix", // string, function or default to stack name
		schemaFile: "path/to/my/schema",
		schemaText: `GRAPHQL SCHEMA`,
		defaultsDirectory: "path/to/my/dir",
		overridesDirectory: "path/to/my/dir",
		defaults: {
			Table: {
				// name of type, these functions apply to all constructs of this type,  all camel case
				onProps: (scope, systemDefaultProps, context) => {
					// explicitly before each construct
					return {
						someProperty: "someValue",
					};
				},
				onConstruct: (scope, construct, context) => {
					// explicitly after each construct
					construct.someMethod("someValue");
					return construct;
				},
			},
		},
		overrides: {
			// name of construct,  all camel case
			analyzeThisFunction: {
				onProps: (scope, props, context) => {
					return {
						someProperty: "someValue",
					};
				},
				onConstruct: (scope, construct, context) => {
					// explicitly after
					construct.someMethod("someValue");
					return construct;
				},
			},
		},
		resolvers: {
			runNeedsAnalysisResolver: {
				pipeline: [""],
				requestTemplate: "", // nil uses default templates
				responseTemplate: "", // nil uses default templates
			},
		},
		datasourceProviders: [
			// implicity added
			lambdaDataSourceProvider,
			dynamoDataSourceProvider,
		],
	});
	const {
		api,
		datasources,
		tables,
		functions,
		resolvers,
	} = appSyncSchemaStack.getResources();

	// all camel case
	const { runNeedsAnalysisTable } = tables;
	const { runNeedsAnalysisDS } = datasources;
	const { runNeedsAnalysisFunction } = functions;
	const { runNeedsAnalysisResolver } = resolvers;
}
