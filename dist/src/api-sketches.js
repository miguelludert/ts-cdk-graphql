"use strict";
function example() {
    const appSyncSchemaStack = new AppSyncSchemaStack(this, "stack-name", {
        environment: {
            SOME_VAR: "SOME_VALUE",
        },
        context: {
            // only used if we want to pass something to our overrides
            SOME_VAR: "SOME_VALUE",
        },
        prefix: "prefix",
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
                requestTemplate: "",
                responseTemplate: "",
            },
        },
        datasourceProviders: [
            // implicity added
            lambdaDataSourceProvider,
            dynamoDataSourceProvider,
        ],
    });
    const { api, datasources, tables, functions, resolvers, } = appSyncSchemaStack.getResources();
    // all camel case
    const { runNeedsAnalysisTable } = tables;
    const { runNeedsAnalysisDS } = datasources;
    const { runNeedsAnalysisFunction } = functions;
    const { runNeedsAnalysisResolver } = resolvers;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLXNrZXRjaGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS1za2V0Y2hlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsU0FBUyxPQUFPO0lBQ2YsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7UUFDckUsV0FBVyxFQUFFO1lBQ1osUUFBUSxFQUFFLFlBQVk7U0FDdEI7UUFDRCxPQUFPLEVBQUU7WUFDUiwwREFBMEQ7WUFDMUQsUUFBUSxFQUFFLFlBQVk7U0FDdEI7UUFDRCxNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUUsbUJBQW1CO1FBQy9CLFVBQVUsRUFBRSxnQkFBZ0I7UUFDNUIsaUJBQWlCLEVBQUUsZ0JBQWdCO1FBQ25DLGtCQUFrQixFQUFFLGdCQUFnQjtRQUNwQyxRQUFRLEVBQUU7WUFDVCxLQUFLLEVBQUU7Z0JBQ04sc0ZBQXNGO2dCQUN0RixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxFQUFFLEVBQUU7b0JBQy9DLG1DQUFtQztvQkFDbkMsT0FBTzt3QkFDTixZQUFZLEVBQUUsV0FBVztxQkFDekIsQ0FBQztnQkFDSCxDQUFDO2dCQUNELFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEVBQUU7b0JBQzFDLGtDQUFrQztvQkFDbEMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDbEMsT0FBTyxTQUFTLENBQUM7Z0JBQ2xCLENBQUM7YUFDRDtTQUNEO1FBQ0QsU0FBUyxFQUFFO1lBQ1YscUNBQXFDO1lBQ3JDLG1CQUFtQixFQUFFO2dCQUNwQixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO29CQUNsQyxPQUFPO3dCQUNOLFlBQVksRUFBRSxXQUFXO3FCQUN6QixDQUFDO2dCQUNILENBQUM7Z0JBQ0QsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRTtvQkFDMUMsbUJBQW1CO29CQUNuQixTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNsQyxPQUFPLFNBQVMsQ0FBQztnQkFDbEIsQ0FBQzthQUNEO1NBQ0Q7UUFDRCxTQUFTLEVBQUU7WUFDVix3QkFBd0IsRUFBRTtnQkFDekIsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNkLGVBQWUsRUFBRSxFQUFFO2dCQUNuQixnQkFBZ0IsRUFBRSxFQUFFO2FBQ3BCO1NBQ0Q7UUFDRCxtQkFBbUIsRUFBRTtZQUNwQixrQkFBa0I7WUFDbEIsd0JBQXdCO1lBQ3hCLHdCQUF3QjtTQUN4QjtLQUNELENBQUMsQ0FBQztJQUNILE1BQU0sRUFDTCxHQUFHLEVBQ0gsV0FBVyxFQUNYLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxHQUNULEdBQUcsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFFdEMsaUJBQWlCO0lBQ2pCLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUN6QyxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxXQUFXLENBQUM7SUFDM0MsTUFBTSxFQUFFLHdCQUF3QixFQUFFLEdBQUcsU0FBUyxDQUFDO0lBQy9DLE1BQU0sRUFBRSx3QkFBd0IsRUFBRSxHQUFHLFNBQVMsQ0FBQztBQUNoRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZXhhbXBsZSgpIHtcblx0Y29uc3QgYXBwU3luY1NjaGVtYVN0YWNrID0gbmV3IEFwcFN5bmNTY2hlbWFTdGFjayh0aGlzLCBcInN0YWNrLW5hbWVcIiwge1xuXHRcdGVudmlyb25tZW50OiB7XG5cdFx0XHRTT01FX1ZBUjogXCJTT01FX1ZBTFVFXCIsXG5cdFx0fSxcblx0XHRjb250ZXh0OiB7XG5cdFx0XHQvLyBvbmx5IHVzZWQgaWYgd2Ugd2FudCB0byBwYXNzIHNvbWV0aGluZyB0byBvdXIgb3ZlcnJpZGVzXG5cdFx0XHRTT01FX1ZBUjogXCJTT01FX1ZBTFVFXCIsXG5cdFx0fSxcblx0XHRwcmVmaXg6IFwicHJlZml4XCIsIC8vIHN0cmluZywgZnVuY3Rpb24gb3IgZGVmYXVsdCB0byBzdGFjayBuYW1lXG5cdFx0c2NoZW1hRmlsZTogXCJwYXRoL3RvL215L3NjaGVtYVwiLFxuXHRcdHNjaGVtYVRleHQ6IGBHUkFQSFFMIFNDSEVNQWAsXG5cdFx0ZGVmYXVsdHNEaXJlY3Rvcnk6IFwicGF0aC90by9teS9kaXJcIixcblx0XHRvdmVycmlkZXNEaXJlY3Rvcnk6IFwicGF0aC90by9teS9kaXJcIixcblx0XHRkZWZhdWx0czoge1xuXHRcdFx0VGFibGU6IHtcblx0XHRcdFx0Ly8gbmFtZSBvZiB0eXBlLCB0aGVzZSBmdW5jdGlvbnMgYXBwbHkgdG8gYWxsIGNvbnN0cnVjdHMgb2YgdGhpcyB0eXBlLCAgYWxsIGNhbWVsIGNhc2Vcblx0XHRcdFx0b25Qcm9wczogKHNjb3BlLCBzeXN0ZW1EZWZhdWx0UHJvcHMsIGNvbnRleHQpID0+IHtcblx0XHRcdFx0XHQvLyBleHBsaWNpdGx5IGJlZm9yZSBlYWNoIGNvbnN0cnVjdFxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRzb21lUHJvcGVydHk6IFwic29tZVZhbHVlXCIsXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSxcblx0XHRcdFx0b25Db25zdHJ1Y3Q6IChzY29wZSwgY29uc3RydWN0LCBjb250ZXh0KSA9PiB7XG5cdFx0XHRcdFx0Ly8gZXhwbGljaXRseSBhZnRlciBlYWNoIGNvbnN0cnVjdFxuXHRcdFx0XHRcdGNvbnN0cnVjdC5zb21lTWV0aG9kKFwic29tZVZhbHVlXCIpO1xuXHRcdFx0XHRcdHJldHVybiBjb25zdHJ1Y3Q7XG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdH0sXG5cdFx0b3ZlcnJpZGVzOiB7XG5cdFx0XHQvLyBuYW1lIG9mIGNvbnN0cnVjdCwgIGFsbCBjYW1lbCBjYXNlXG5cdFx0XHRhbmFseXplVGhpc0Z1bmN0aW9uOiB7XG5cdFx0XHRcdG9uUHJvcHM6IChzY29wZSwgcHJvcHMsIGNvbnRleHQpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0c29tZVByb3BlcnR5OiBcInNvbWVWYWx1ZVwiLFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9uQ29uc3RydWN0OiAoc2NvcGUsIGNvbnN0cnVjdCwgY29udGV4dCkgPT4ge1xuXHRcdFx0XHRcdC8vIGV4cGxpY2l0bHkgYWZ0ZXJcblx0XHRcdFx0XHRjb25zdHJ1Y3Quc29tZU1ldGhvZChcInNvbWVWYWx1ZVwiKTtcblx0XHRcdFx0XHRyZXR1cm4gY29uc3RydWN0O1xuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdHJlc29sdmVyczoge1xuXHRcdFx0cnVuTmVlZHNBbmFseXNpc1Jlc29sdmVyOiB7XG5cdFx0XHRcdHBpcGVsaW5lOiBbXCJcIl0sXG5cdFx0XHRcdHJlcXVlc3RUZW1wbGF0ZTogXCJcIiwgLy8gbmlsIHVzZXMgZGVmYXVsdCB0ZW1wbGF0ZXNcblx0XHRcdFx0cmVzcG9uc2VUZW1wbGF0ZTogXCJcIiwgLy8gbmlsIHVzZXMgZGVmYXVsdCB0ZW1wbGF0ZXNcblx0XHRcdH0sXG5cdFx0fSxcblx0XHRkYXRhc291cmNlUHJvdmlkZXJzOiBbXG5cdFx0XHQvLyBpbXBsaWNpdHkgYWRkZWRcblx0XHRcdGxhbWJkYURhdGFTb3VyY2VQcm92aWRlcixcblx0XHRcdGR5bmFtb0RhdGFTb3VyY2VQcm92aWRlcixcblx0XHRdLFxuXHR9KTtcblx0Y29uc3Qge1xuXHRcdGFwaSxcblx0XHRkYXRhc291cmNlcyxcblx0XHR0YWJsZXMsXG5cdFx0ZnVuY3Rpb25zLFxuXHRcdHJlc29sdmVycyxcblx0fSA9IGFwcFN5bmNTY2hlbWFTdGFjay5nZXRSZXNvdXJjZXMoKTtcblxuXHQvLyBhbGwgY2FtZWwgY2FzZVxuXHRjb25zdCB7IHJ1bk5lZWRzQW5hbHlzaXNUYWJsZSB9ID0gdGFibGVzO1xuXHRjb25zdCB7IHJ1bk5lZWRzQW5hbHlzaXNEUyB9ID0gZGF0YXNvdXJjZXM7XG5cdGNvbnN0IHsgcnVuTmVlZHNBbmFseXNpc0Z1bmN0aW9uIH0gPSBmdW5jdGlvbnM7XG5cdGNvbnN0IHsgcnVuTmVlZHNBbmFseXNpc1Jlc29sdmVyIH0gPSByZXNvbHZlcnM7XG59XG4iXX0=