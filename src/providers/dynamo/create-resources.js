import {
	createDynamoResolverProps,
	createDynamoTableProps,
} from "./create-props";
import { toPairs, fromPairs } from "ramda";

export const createDynamoTableDataSource = (scope, options, api, tableProps, resolverProps) => {
		// const {
		// 	resolverProps,
		// 	dataSourceName,
		// 	description,
		// 	dataSourceProps,
		// 	tableProps,
		// } = dynamoParams;
		const { prefix } = options || {};
		const actualTableProps = getProps(
			"TableProps",
			"blog-table.tableProps",
			tableProps,
		);
		const table = new Table(scope, dataSourceName, actualTableProps);
		const dataSource = api.addDynamoDbDataSource(
			dataSourceName,
			description,
			table,
		);
		if (dynamoParams.GSI) {
			dynamoParams.GSI.map((index) => table.addGlobalSecondaryIndex(index));
		}
		if (dynamoParams.LSI) {
			dynamoParams.LSI.map((index) => table.addLocalSecondaryIndex(index));
		}
		const resolvers = resolverProps.map((resolverProp) => {
			const modifiedProp = { resolverProp };
			return dataSource.createResolver(createBaseResolverProps(resolverProp));
		});
		return {
			table,
			dataSource,
			resolvers,
		};
	};

export const getDynamoDataSources = (options, codeGen) => {
	const stacks = toPairs(codeGen.stacks);
	const tables = stackMapping.filter(([key,value]) => {
		return value.Type === RESOURCE_TYPE_DATASOURCE && value.Properties.Type === DATASOURCE_TYPE_DYNAMO;
	});
	return tables.map(([key, value]) => ({
		...createDynamoTableProps(key, stackName, codeGen),
		...createDynamoResolverProps(key, stackName, codeGen),
	}));
};
