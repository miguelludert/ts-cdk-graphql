"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepModule = void 0;
const testing_1 = require("../../../testing");
// this is an experimental function to enable mocking within the same file as the invoked function
const prepModule = (name) => {
    jest.mock(name);
    const mock = jest.requireMock(name);
    const underTest = jest.requireActual(name);
    beforeEach(() => {
        jest.resetAllMocks();
    });
    return {
        mock,
        underTest,
    };
};
exports.prepModule = prepModule;
describe("Dynamo Create Props", () => {
    const { mock, underTest } = exports.prepModule("../create-props");
    describe("createSingleDynamoTableProp", () => {
        it("should create props for one table", () => {
            const name = "CommentTable";
            const expected = {
                dataSourceName: "commentTable",
                tableProps: {
                    tableName: "comment-table",
                    partitionKey: { name: "blogPostId", type: "S" },
                    sortKey: { name: "commentId", type: "S" },
                    removalPolicy: undefined,
                },
            };
            const { CommentTable: resource } = testing_1.testSchema.stacks.Comment.Resources;
            const actual = underTest.createSingleDynamoTableProp(name, resource);
            expect(actual).toEqual(expected);
        });
    });
    describe("createDynamoTableProps", () => {
        it("should create ", () => {
            const expected = {
                Blog: ["mock Blog"],
                BlogPost: ["mock BlogPost"],
                Comment: ["mock Comment"],
            };
            const mockCurriedFunction = jest.fn();
            mock.createSingleDynamoTableProp.mockImplementation((name) => {
                return mockCurriedFunction.mockImplementationOnce((schema) => `mock ${name}`);
            });
            const actual = underTest.createDynamoTableProps(testing_1.testSchema);
            expect(actual).toEqual(expected);
        });
    });
    describe("getDynamoAttributeProps", () => {
        it("should get dynamo attribute props", () => {
            const { KeySchema, AttributeDefinitions, } = testing_1.testSchema.stacks.Comment.Resources.CommentTable.Properties;
            const expected = {
                partitionKey: { name: "blogPostId", type: "S" },
                sortKey: { name: "commentId", type: "S" },
            };
            const actual = underTest.getDynamoAttributeProps(KeySchema, AttributeDefinitions);
            expect(actual).toEqual(expected);
        });
    });
    describe("getIndex", () => {
        it("should get an index", () => {
            const indexes = [
                {
                    IndexName: "index name 1",
                    KeySchema: "key schema 1",
                    Projection: { ProjectionType: "projection type 1" },
                },
                {
                    IndexName: "index name 2",
                    KeySchema: "key schema 2",
                    Projection: { ProjectionType: "projection type 2" },
                },
                {
                    IndexName: "index name 3",
                    KeySchema: "key schema 3",
                    Projection: { ProjectionType: "projection type 3" },
                },
            ];
            const name = "fieldName";
            const attributeDefinitions = "attribute definitions";
            const expected = {
                fieldName: [
                    {
                        indexName: "index name 1",
                        projectionType: "projection type 1",
                        result: "props 1",
                    },
                    {
                        indexName: "index name 2",
                        projectionType: "projection type 2",
                        result: "props 2",
                    },
                    {
                        indexName: "index name 3",
                        projectionType: "projection type 3",
                        result: "props 3",
                    },
                ],
            };
            mock.getDynamoAttributeProps.mockReturnValueOnce({ result: "props 1" });
            mock.getDynamoAttributeProps.mockReturnValueOnce({ result: "props 2" });
            mock.getDynamoAttributeProps.mockReturnValueOnce({ result: "props 3" });
            const actual = underTest.getIndex(name, attributeDefinitions, indexes);
            expect(actual).toEqual(expected);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXByb3BzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3Rlc3RzL2NyZWF0ZS1wcm9wcy50ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhDQUFvRDtBQUVwRCxrR0FBa0c7QUFDM0YsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtJQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2YsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTztRQUNOLElBQUk7UUFDSixTQUFTO0tBQ1QsQ0FBQztBQUNILENBQUMsQ0FBQztBQVhXLFFBQUEsVUFBVSxjQVdyQjtBQUVGLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDcEMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxrQkFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDMUQsUUFBUSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUM1QyxFQUFFLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1lBQzVDLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQztZQUM1QixNQUFNLFFBQVEsR0FBRztnQkFDaEIsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLFVBQVUsRUFBRTtvQkFDWCxTQUFTLEVBQUUsZUFBZTtvQkFDMUIsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO29CQUMvQyxPQUFPLEVBQUUsRUFB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RCxDQUFDO1lBQ0YsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDO1lBQ3pCLE1BQU0sb0JBQW9CLEdBQUcsdUJBQXVCLENBQUM7WUFDckQsTUFBTSxRQUFRLEdBQUc7Z0JBQ2hCLFNBQVMsRUFBRTtvQkFDVjt3QkFDQyxTQUFTLEVBQUUsY0FBYzt3QkFDekIsY0FBYyxFQUFFLG1CQUFtQjt3QkFDbkMsTUFBTSxFQUFFLFNBQVM7cUJBQ2pCO29CQUNEO3dCQUNDLFNBQVMsRUFBRSxjQUFjO3dCQUN6QixjQUFjLEVBQUUsbUJBQW1CO3dCQUNuQyxNQUFNLEVBQUUsU0FBUztxQkFDakI7b0JBQ0Q7d0JBQ0MsU0FBUyxFQUFFLGNBQWM7d0JBQ3pCLGNBQWMsRUFBRSxtQkFBbUI7d0JBQ25DLE1BQU0sRUFBRSxTQUFTO3FCQUNqQjtpQkFDRDthQUNELENBQUM7WUFDRixJQUFJLENBQUMsdUJBQXVCLENBQUMsbUJBQW1CLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsbUJBQW1CLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUN4RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsbUJBQW1CLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUN4RSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN2RSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGR1bXAsIHRlc3RTY2hlbWEgfSBmcm9tIFwiLi4vLi4vLi4vdGVzdGluZ1wiO1xuXG4vLyB0aGlzIGlzIGFuIGV4cGVyaW1lbnRhbCBmdW5jdGlvbiB0byBlbmFibGUgbW9ja2luZyB3aXRoaW4gdGhlIHNhbWUgZmlsZSBhcyB0aGUgaW52b2tlZCBmdW5jdGlvblxuZXhwb3J0IGNvbnN0IHByZXBNb2R1bGUgPSAobmFtZSkgPT4ge1xuXHRqZXN0Lm1vY2sobmFtZSk7XG5cdGNvbnN0IG1vY2sgPSBqZXN0LnJlcXVpcmVNb2NrKG5hbWUpO1xuXHRjb25zdCB1bmRlclRlc3QgPSBqZXN0LnJlcXVpcmVBY3R1YWwobmFtZSk7XG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdGplc3QucmVzZXRBbGxNb2NrcygpO1xuXHR9KTtcblx0cmV0dXJuIHtcblx0XHRtb2NrLFxuXHRcdHVuZGVyVGVzdCxcblx0fTtcbn07XG5cbmRlc2NyaWJlKFwiRHluYW1vIENyZWF0ZSBQcm9wc1wiLCAoKSA9PiB7XG5cdGNvbnN0IHsgbW9jaywgdW5kZXJUZXN0IH0gPSBwcmVwTW9kdWxlKFwiLi4vY3JlYXRlLXByb3BzXCIpO1xuXHRkZXNjcmliZShcImNyZWF0ZVNpbmdsZUR5bmFtb1RhYmxlUHJvcFwiLCAoKSA9PiB7XG5cdFx0aXQoXCJzaG91bGQgY3JlYXRlIHByb3BzIGZvciBvbmUgdGFibGVcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc3QgbmFtZSA9IFwiQ29tbWVudFRhYmxlXCI7XG5cdFx0XHRjb25zdCBleHBlY3RlZCA9IHtcblx0XHRcdFx0ZGF0YVNvdXJjZU5hbWU6IFwiY29tbWVudFRhYmxlXCIsXG5cdFx0XHRcdHRhYmxlUHJvcHM6IHtcblx0XHRcdFx0XHR0YWJsZU5hbWU6IFwiY29tbWVudC10YWJsZVwiLFxuXHRcdFx0XHRcdHBhcnRpdGlvbktleTogeyBuYW1lOiBcImJsb2dQb3N0SWRcIiwgdHlwZTogXCJTXCIgfSxcblx0XHRcdFx0XHRzb3J0S2V5OiB7IG5hbWU6IFwiY29tbWVudElkXCIsIHR5cGU6IFwiU1wiIH0sXG5cdFx0XHRcdFx0cmVtb3ZhbFBvbGljeTogdW5kZWZpbmVkLFxuXHRcdFx0XHR9LFxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IHsgQ29tbWVudFRhYmxlOiByZXNvdXJjZSB9ID0gdGVzdFNjaGVtYS5zdGFja3MuQ29tbWVudC5SZXNvdXJjZXM7XG5cdFx0XHRjb25zdCBhY3R1YWwgPSB1bmRlclRlc3QuY3JlYXRlU2luZ2xlRHluYW1vVGFibGVQcm9wKG5hbWUsIHJlc291cmNlKTtcblx0XHRcdGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuXHRcdH0pO1xuXHR9KTtcblx0ZGVzY3JpYmUoXCJjcmVhdGVEeW5hbW9UYWJsZVByb3BzXCIsICgpID0+IHtcblx0XHRpdChcInNob3VsZCBjcmVhdGUgXCIsICgpID0+IHtcblx0XHRcdGNvbnN0IGV4cGVjdGVkID0ge1xuXHRcdFx0XHRCbG9nOiBbXCJtb2NrIEJsb2dcIl0sXG5cdFx0XHRcdEJsb2dQb3N0OiBbXCJtb2NrIEJsb2dQb3N0XCJdLFxuXHRcdFx0XHRDb21tZW50OiBbXCJtb2NrIENvbW1lbnRcIl0sXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgbW9ja0N1cnJpZWRGdW5jdGlvbiA9IGplc3QuZm4oKTtcblx0XHRcdG1vY2suY3JlYXRlU2luZ2xlRHluYW1vVGFibGVQcm9wLm1vY2tJbXBsZW1lbnRhdGlvbigobmFtZSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gbW9ja0N1cnJpZWRGdW5jdGlvbi5tb2NrSW1wbGVtZW50YXRpb25PbmNlKFxuXHRcdFx0XHRcdChzY2hlbWEpID0+YG1vY2sgJHtuYW1lfWAsXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGFjdHVhbCA9IHVuZGVyVGVzdC5jcmVhdGVEeW5hbW9UYWJsZVByb3BzKHRlc3RTY2hlbWEpO1xuXHRcdFx0ZXhwZWN0KGFjdHVhbCkudG9FcXVhbChleHBlY3RlZCk7XG5cdFx0fSk7XG5cdH0pO1xuXHRkZXNjcmliZShcImdldER5bmFtb0F0dHJpYnV0ZVByb3BzXCIsICgpID0+IHtcblx0XHRpdChcInNob3VsZCBnZXQgZHluYW1vIGF0dHJpYnV0ZSBwcm9wc1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zdCB7XG5cdFx0XHRcdEtleVNjaGVtYSxcblx0XHRcdFx0QXR0cmlidXRlRGVmaW5pdGlvbnMsXG5cdFx0XHR9ID0gdGVzdFNjaGVtYS5zdGFja3MuQ29tbWVudC5SZXNvdXJjZXMuQ29tbWVudFRhYmxlLlByb3BlcnRpZXM7XG5cdFx0XHRjb25zdCBleHBlY3RlZCA9IHtcblx0XHRcdFx0cGFydGl0aW9uS2V5OiB7IG5hbWU6IFwiYmxvZ1Bvc3RJZFwiLCB0eXBlOiBcIlNcIiB9LFxuXHRcdFx0XHRzb3J0S2V5OiB7IG5hbWU6IFwiY29tbWVudElkXCIsIHR5cGU6IFwiU1wiIH0sXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgYWN0dWFsID0gdW5kZXJUZXN0LmdldER5bmFtb0F0dHJpYnV0ZVByb3BzKFxuXHRcdFx0XHRLZXlTY2hlbWEsXG5cdFx0XHRcdEF0dHJpYnV0ZURlZmluaXRpb25zLFxuXHRcdFx0KTtcblx0XHRcdGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuXHRcdH0pO1xuXHR9KTtcblx0ZGVzY3JpYmUoXCJnZXRJbmRleFwiLCAoKSA9PiB7XG5cdFx0aXQoXCJzaG91bGQgZ2V0IGFuIGluZGV4XCIsICgpID0+IHtcblx0XHRcdGNvbnN0IGluZGV4ZXMgPSBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRJbmRleE5hbWU6IFwiaW5kZXggbmFtZSAxXCIsXG5cdFx0XHRcdFx0S2V5U2NoZW1hOiBcImtleSBzY2hlbWEgMVwiLFxuXHRcdFx0XHRcdFByb2plY3Rpb246IHsgUHJvamVjdGlvblR5cGU6IFwicHJvamVjdGlvbiB0eXBlIDFcIiB9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0SW5kZXhOYW1lOiBcImluZGV4IG5hbWUgMlwiLFxuXHRcdFx0XHRcdEtleVNjaGVtYTogXCJrZXkgc2NoZW1hIDJcIixcblx0XHRcdFx0XHRQcm9qZWN0aW9uOiB7IFByb2plY3Rpb25UeXBlOiBcInByb2plY3Rpb24gdHlwZSAyXCIgfSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdEluZGV4TmFtZTogXCJpbmRleCBuYW1lIDNcIixcblx0XHRcdFx0XHRLZXlTY2hlbWE6IFwia2V5IHNjaGVtYSAzXCIsXG5cdFx0XHRcdFx0UHJvamVjdGlvbjogeyBQcm9qZWN0aW9uVHlwZTogXCJwcm9qZWN0aW9uIHR5cGUgM1wiIH0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdO1xuXHRcdFx0Y29uc3QgbmFtZSA9IFwiZmllbGROYW1lXCI7XG5cdFx0XHRjb25zdCBhdHRyaWJ1dGVEZWZpbml0aW9ucyA9IFwiYXR0cmlidXRlIGRlZmluaXRpb25zXCI7XG5cdFx0XHRjb25zdCBleHBlY3RlZCA9IHtcblx0XHRcdFx0ZmllbGROYW1lOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aW5kZXhOYW1lOiBcImluZGV4IG5hbWUgMVwiLFxuXHRcdFx0XHRcdFx0cHJvamVjdGlvblR5cGU6IFwicHJvamVjdGlvbiB0eXBlIDFcIixcblx0XHRcdFx0XHRcdHJlc3VsdDogXCJwcm9wcyAxXCIsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRpbmRleE5hbWU6IFwiaW5kZXggbmFtZSAyXCIsXG5cdFx0XHRcdFx0XHRwcm9qZWN0aW9uVHlwZTogXCJwcm9qZWN0aW9uIHR5cGUgMlwiLFxuXHRcdFx0XHRcdFx0cmVzdWx0OiBcInByb3BzIDJcIixcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGluZGV4TmFtZTogXCJpbmRleCBuYW1lIDNcIixcblx0XHRcdFx0XHRcdHByb2plY3Rpb25UeXBlOiBcInByb2plY3Rpb24gdHlwZSAzXCIsXG5cdFx0XHRcdFx0XHRyZXN1bHQ6IFwicHJvcHMgM1wiLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdF0sXG5cdFx0XHR9O1xuXHRcdFx0bW9jay5nZXREeW5hbW9BdHRyaWJ1dGVQcm9wcy5tb2NrUmV0dXJuVmFsdWVPbmNlKHsgcmVzdWx0OiBcInByb3BzIDFcIiB9KTtcblx0XHRcdG1vY2suZ2V0RHluYW1vQXR0cmlidXRlUHJvcHMubW9ja1JldHVyblZhbHVlT25jZSh7IHJlc3VsdDogXCJwcm9wcyAyXCIgfSk7XG5cdFx0XHRtb2NrLmdldER5bmFtb0F0dHJpYnV0ZVByb3BzLm1vY2tSZXR1cm5WYWx1ZU9uY2UoeyByZXN1bHQ6IFwicHJvcHMgM1wiIH0pO1xuXHRcdFx0Y29uc3QgYWN0dWFsID0gdW5kZXJUZXN0LmdldEluZGV4KG5hbWUsIGF0dHJpYnV0ZURlZmluaXRpb25zLCBpbmRleGVzKTtcblx0XHRcdGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuXHRcdH0pO1xuXHR9KTtcbn0pO1xuIl19