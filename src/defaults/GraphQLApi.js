export default {
	onProps: (scope, props, context) => {
		return {
			name : context.resourceName
		};
	},
	onConstruct: () => {},
};
