"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndex = exports.getDynamoAttributeProps = exports.createSingleDynamoTableProp = exports.createDynamoResources = exports.createDynamoDataSource = void 0;
const utils_1 = require("./utils");
const ramda_1 = require("ramda");
const aws_dynamodb_1 = require("@aws-cdk/aws-dynamodb");
const constants_1 = require("../constants");
const self = __importStar(require("./dynamo"));
const createDynamoDataSource = (scope, stackProps, api, cfSchema) => {
    utils_1.info("createDynamoDataSource");
    const datasourceCfn = utils_1.getDatasourceCfn(constants_1.DATASOURCE_TYPE_DYNAMO, cfSchema);
    const bob = datasourceCfn.map(self.createSingleDynamoTableProp(stackProps));
    const datasources = bob.map(self.createDynamoResources(scope, api));
    return datasources;
};
exports.createDynamoDataSource = createDynamoDataSource;
exports.createDynamoResources = ramda_1.curry((scope, api, props) => {
    utils_1.info("createDynamoResources");
    const { datasourceName, tableProps } = props;
    const table = new aws_dynamodb_1.Table(scope, tableProps.tableName, tableProps);
    const datasource = api.addDynamoDbDataSource(datasourceName, table, {
        description: datasourceName,
        name: datasourceName,
    });
    if (props.GSI) {
        props.GSI.map((index) => table.addGlobalSecondaryIndex(index));
    }
    if (props.LSI) {
        props.LSI.map((index) => table.addLocalSecondaryIndex(index));
    }
    const result = Object.assign({ table,
        datasource }, props);
    return result;
});
exports.createSingleDynamoTableProp = ramda_1.curry((props, { stackName, resourcePairs, datasourceName, datasourceCfn }) => {
    utils_1.info("createSingleDynamoTableProp");
    const [tableNameRaw, tableCfn] = resourcePairs.find(([resourceName, resourceCfn]) => resourceCfn.Type == constants_1.RESOURCE_TYPE_DYNAMO);
    let tableName = `${tableNameRaw}-table`;
    if (props && props.namingConvention) {
        tableName = props.namingConvention(tableNameRaw, 'table');
    }
    const { DeletionPolicy, KeySchema, AttributeDefinitions, LocalSecondaryIndexes, GlobalSecondaryIndexes, } = tableCfn.Properties;
    const result = Object.assign(Object.assign({ stackName,
        datasourceCfn,
        datasourceName,
        tableCfn,
        tableName, tableProps: Object.assign(Object.assign({ tableName }, exports.getDynamoAttributeProps(KeySchema, AttributeDefinitions)), { removalPolicy: DeletionPolicy }) }, self.getIndex("GSI", GlobalSecondaryIndexes)), self.getIndex("LSI", LocalSecondaryIndexes));
    return result;
});
const getDynamoAttributeProps = (keySchema, attributeDefinitions) => {
    utils_1.info("getDynamoAttributeProps");
    const result = {};
    const getAttributeTypes = (name) => {
        const attr = attributeDefinitions.find((x) => x.AttributeName == name);
        return {
            S: aws_dynamodb_1.AttributeType.STRING,
            N: aws_dynamodb_1.AttributeType.NUMBER,
            B: aws_dynamodb_1.AttributeType.BINARY,
        }[attr.AttributeType];
    };
    if (keySchema[0]) {
        result.partitionKey = {
            name: keySchema[0].AttributeName,
            type: getAttributeTypes(keySchema[0].AttributeName),
        };
    }
    if (keySchema[1]) {
        result.sortKey = {
            name: keySchema[1].AttributeName,
            type: getAttributeTypes(keySchema[1].AttributeName),
        };
    }
    return result;
};
exports.getDynamoAttributeProps = getDynamoAttributeProps;
exports.getIndex = ramda_1.defaultTo({}, (name, attributeDefinitions, indexes) => {
    utils_1.info("getIndex");
    if (indexes) {
        return {
            [name]: indexes.map(({ IndexName, KeySchema, Projection }) => (Object.assign({ indexName: IndexName, projectionType: Projection && Projection.ProjectionType }, self.getDynamoAttributeProps(KeySchema, attributeDefinitions)))),
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy9keW5hbW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFpRDtBQUNqRCxpQ0FBZ0Q7QUFDaEQsd0RBQTZEO0FBQzdELDRDQUE0RTtBQUM1RSwrQ0FBaUM7QUFFMUIsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFO0lBQzFFLFlBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQy9CLE1BQU0sYUFBYSxHQUFHLHdCQUFnQixDQUNyQyxrQ0FBc0IsRUFDdEIsUUFBUSxDQUNSLENBQUM7SUFDRixNQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLE9BQU8sV0FBVyxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQVRXLFFBQUEsc0JBQXNCLDBCQVNqQztBQUVXLFFBQUEscUJBQXFCLEdBQUcsYUFBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtJQUNoRSxZQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUM5QixNQUFNLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUM3QyxNQUFNLEtBQUssR0FBRyxJQUFJLG9CQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakUsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLHFCQUFxQixDQUFDLGNBQWMsRUFBRSxL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LElBQUksRUFBRSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1NBQ25ELENBQUM7S0FDRjtJQUNELElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2pCLE1BQU0sQ0FBQyxPQUFPLEdBQUc7WUFDaEIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhO1lBQ2hDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1NBQ25ELENBQUM7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBeEJXLFFBQUEsdUJBQXVCLDJCQXdCbEM7QUFFVyxRQUFBLFFBQVEsR0FBRyxpQkFBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUM3RSxZQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakIsSUFBSSxPQUFPLEVBQUU7UUFDWixPQUFPO1lBQ04sQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxpQkFDN0QsU0FBUyxFQUFFLFNBQVMsRUFDcEIsY0FBYyxFQUFFLFVBQVUsSUFBSSxVQUFVLENBQUMsY0FBYyxJQUNwRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDLEVBQy9ELENBQUM7U0FDSCxDQUFDO0tBQ0Y7QUFDRixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERhdGFzb3VyY2VDZm4sIGluZm8gfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgY3VycnksIGRlZmF1bHRUbywgY3VycnkgfSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCB7IFRhYmxlLCBBdHRyaWJ1dGVUeXBlIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1keW5hbW9kYlwiO1xuaW1wb3J0IHsgUkVTT1VSQ0VfVFlQRV9EWU5BTU8sIERBVEFTT1VSQ0VfVFlQRV9EWU5BTU8gfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgKiBhcyBzZWxmIGZyb20gXCIuL2R5bmFtb1wiO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlRHluYW1vRGF0YVNvdXJjZSA9IChzY29wZSwgc3RhY2tQcm9wcywgYXBpLCBjZlNjaGVtYSkgPT4ge1xuXHRpbmZvKFwiY3JlYXRlRHluYW1vRGF0YVNvdXJjZVwiKTtcblx0Y29uc3QgZGF0YXNvdXJjZUNmbiA9IGdldERhdGFzb3VyY2VDZm4oXG5cdFx0REFUQVNPVVJDRV9UWVBFX0RZTkFNTyxcblx0XHRjZlNjaGVtYVxuXHQpO1xuXHRjb25zdCBib2IgPSBkYXRhc291cmNlQ2ZuLm1hcChzZWxmLmNyZWF0ZVNpbmdsZUR5bmFtb1RhYmxlUHJvcChzdGFja1Byb3BzKSk7XG5cdGNvbnN0IGRhdGFzb3VyY2VzID0gYm9iLm1hcChzZWxmLmNyZWF0ZUR5bmFtb1Jlc291cmNlcyhzY29wZSwgYXBpKSk7XG5cdHJldHVybiBkYXRhc291cmNlcztcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVEeW5hbW9SZXNvdXJjZXMgPSBjdXJyeSgoc2NvcGUsIGFwaSwgcHJvcHMpID0+IHtcblx0aW5mbyhcImNyZWF0ZUR5bmFtb1Jlc291cmNlc1wiKTtcblx0Y29uc3QgeyBkYXRhc291cmNlTmFtZSwgdGFibGVQcm9wcyB9ID0gcHJvcHM7XG5cdGNvbnN0IHRhYmxlID0gbmV3IFRhYmxlKHNjb3BlLCB0YWJsZVByb3BzLnRhYmxlTmFtZSwgdGFibGVQcm9wcyk7XG5cdGNvbnN0IGRhdGFzb3VyY2UgPSBhcGkuYWRkRHluYW1vRGJEYXRhU291cmNlKGRhdGFzb3VyY2VOYW1lLCB0YWJsZSwge1xuXHRcdGRlc2NyaXB0aW9uOiBkYXRhc291cmNlTmFtZSxcblx0XHRuYW1lOiBkYXRhc291cmNlTmFtZSxcblx0fSk7XG5cdGlmIChwcm9wcy5HU0kpIHtcblx0XHRwcm9wcy5HU0kubWFwKChpbmRleCkgPT4gdGFibGUuYWRkR2xvYmFsU2Vjb25kYXJ5SW5kZXgoaW5kZXgpKTtcblx0fVxuXHRpZiAocHJvcHMuTFNJKSB7XG5cdFx0cHJvcHMuTFNJLm1hcCgoaW5kZXgpID0+IHRhYmxlLmFkZExvY2FsU2Vjb25kYXJ5SW5kZXgoaW5kZXgpKTtcblx0fVxuXHRjb25zdCByZXN1bHQgPSB7XG5cdFx0dGFibGUsXG5cdFx0ZGF0YXNvdXJjZSxcblx0XHQuLi5wcm9wcyxcblx0fTtcblx0cmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlU2luZ2xlRHluYW1vVGFibGVQcm9wID0gY3VycnkoXG5cdChwcm9wcywgeyBzdGFja05hbWUsIHJlc291cmNlUGFpcnMsIGRhdGFzb3VyY2VOYW1lLCBkYXRhc291cmNlQ2ZuIH0pID0+IHtcblx0XHRpbmZvKFwiY3JlYXRlU2luZ2xlRHluYW1vVGFibGVQcm9wXCIpO1xuXHRcdGNvbnN0IFt0YWJsZU5hbWVSYXcsIHRhYmxlQ2ZuXSA9IHJlc291cmNlUGFpcnMuZmluZChcblx0XHRcdChbcmVzb3VyY2VOYW1lLCByZXNvdXJjZUNmbl0pID0+IHJlc291cmNlQ2ZuLlR5cGUgPT0gUkVTT1VSQ0VfVFlQRV9EWU5BTU8sXG5cdFx0KTtcblxuXHRcdGxldCB0YWJsZU5hbWUgPSBgJHt0YWJsZU5hbWVSYXd9LXRhYmxlYDtcblx0XHRpZihwcm9wcyAmJiBwcm9wcy5uYW1pbmdDb252ZW50aW9uKSB7IFxuXHRcdFx0dGFibGVOYW1lID0gcHJvcHMubmFtaW5nQ29udmVudGlvbih0YWJsZU5hbWVSYXcsICd0YWJsZScpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdERlbGV0aW9uUG9saWN5LFxuXHRcdFx0S2V5U2NoZW1hLFxuXHRcdFx0QXR0cmlidXRlRGVmaW5pdGlvbnMsXG5cdFx0XHRMb2NhbFNlY29uZGFyeUluZGV4ZXMsXG5cdFx0XHRHbG9iYWxTZWNvbmRhcnlJbmRleGVzLFxuXHRcdH0gPSB0YWJsZUNmbi5Qcm9wZXJ0aWVzO1xuXHRcdGNvbnN0IHJlc3VsdCA9IHtcblx0XHRcdHN0YWNrTmFtZSxcblx0XHRcdGRhdGFzb3VyY2VDZm4sXG5cdFx0XHRkYXRhc291cmNlTmFtZSxcblx0XHRcdHRhYmxlQ2ZuLFxuXHRcdFx0dGFibGVOYW1lLFxuXHRcdFx0dGFibGVQcm9wczoge1xuXHRcdFx0XHR0YWJsZU5hbWUsXG5cdFx0XHRcdC4uLmdldER5bmFtb0F0dHJpYnV0ZVByb3BzKEtleVNjaGVtYSwgQXR0cmlidXRlRGVmaW5pdGlvbnMpLFxuXHRcdFx0XHRyZW1vdmFsUG9saWN5OiBEZWxldGlvblBvbGljeSxcblx0XHRcdH0sXG5cdFx0XHQuLi5zZWxmLmdldEluZGV4KFwiR1NJXCIsIEdsb2JhbFNlY29uZGFyeUluZGV4ZXMpLFxuXHRcdFx0Li4uc2VsZi5nZXRJbmRleChcIkxTSVwiLCBMb2NhbFNlY29uZGFyeUluZGV4ZXMpLFxuXHRcdH07XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcbik7XG5cbmV4cG9ydCBjb25zdCBnZXREeW5hbW9BdHRyaWJ1dGVQcm9wcyA9IChrZXlTY2hlbWEsIGF0dHJpYnV0ZURlZmluaXRpb25zKSA9PiB7XG5cdGluZm8oXCJnZXREeW5hbW9BdHRyaWJ1dGVQcm9wc1wiKTtcblx0Y29uc3QgcmVzdWx0ID0ge307XG5cdGNvbnN0IGdldEF0dHJpYnV0ZVR5cGVzID0gKG5hbWUpID0+IHtcblx0XHRjb25zdCBhdHRyID0gYXR0cmlidXRlRGVmaW5pdGlvbnMuZmluZCgoeCkgPT4geC5BdHRyaWJ1dGVOYW1lID09IG5hbWUpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRTOiBBdHRyaWJ1dGVUeXBlLlNUUklORyxcblx0XHRcdE46IEF0dHJpYnV0ZVR5cGUuTlVNQkVSLFxuXHRcdFx0QjogQXR0cmlidXRlVHlwZS5CSU5BUlksXG5cdFx0fVthdHRyLkF0dHJpYnV0ZVR5cGVdO1xuXHR9O1xuXHRpZiAoa2V5U2NoZW1hWzBdKSB7XG5cdFx0cmVzdWx0LnBhcnRpdGlvbktleSA9IHtcblx0XHRcdG5hbWU6IGtleVNjaGVtYVswXS5BdHRyaWJ1dGVOYW1lLFxuXHRcdFx0dHlwZTogZ2V0QXR0cmlidXRlVHlwZXMoa2V5U2NoZW1hWzBdLkF0dHJpYnV0ZU5hbWUpLFxuXHRcdH07XG5cdH1cblx0aWYgKGtleVNjaGVtYVsxXSkge1xuXHRcdHJlc3VsdC5zb3J0S2V5ID0ge1xuXHRcdFx0bmFtZToga2V5U2NoZW1hWzFdLkF0dHJpYnV0ZU5hbWUsXG5cdFx0XHR0eXBlOiBnZXRBdHRyaWJ1dGVUeXBlcyhrZXlTY2hlbWFbMV0uQXR0cmlidXRlTmFtZSksXG5cdFx0fTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4ID0gZGVmYXVsdFRvKHt9LCAobmFtZSwgYXR0cmlidXRlRGVmaW5pdGlvbnMsIGluZGV4ZXMpID0+IHtcblx0aW5mbyhcImdldEluZGV4XCIpO1xuXHRpZiAoaW5kZXhlcykge1xuXHRcdHJldHVybiB7XG5cdFx0XHRbbmFtZV06IGluZGV4ZXMubWFwKCh7IEluZGV4TmFtZSwgS2V5U2NoZW1hLCBQcm9qZWN0aW9uIH0pID0+ICh7XG5cdFx0XHRcdGluZGV4TmFtZTogSW5kZXhOYW1lLFxuXHRcdFx0XHRwcm9qZWN0aW9uVHlwZTogUHJvamVjdGlvbiAmJiBQcm9qZWN0aW9uLlByb2plY3Rpb25UeXBlLFxuXHRcdFx0XHQuLi5zZWxmLmdldER5bmFtb0F0dHJpYnV0ZVByb3BzKEtleVNjaGVtYSwgYXR0cmlidXRlRGVmaW5pdGlvbnMpLFxuXHRcdFx0fSkpLFxuXHRcdH07XG5cdH1cbn0pO1xuIl19