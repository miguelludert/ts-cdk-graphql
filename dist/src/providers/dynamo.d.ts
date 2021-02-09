export function createDynamoDataSource(scope: any, stackProps: any, api: any, cfSchema: any): any;
export const createDynamoResources: any;
export const createSingleDynamoTableProp: any;
export function getDynamoAttributeProps(keySchema: any, attributeDefinitions: any): {
    partitionKey: {
        name: any;
        type: any;
    };
    sortKey: {
        name: any;
        type: any;
    };
};
export const getIndex: any;
