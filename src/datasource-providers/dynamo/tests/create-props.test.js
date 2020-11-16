import { dump, testSchema } from "../../../testing";

// this is an experimental function to enable mocking within the same file as the invoked function
export const prepModule = (name) => {
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

describe("Dynamo Create Props", () => {
	const { mock, underTest } = prepModule("../create-props");
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
			const { CommentTable: resource } = testSchema.stacks.Comment.Resources;
			const actual = underTest.createSingleDynamoTableProp(name, resource);
			expect(actual).toEqual(expected);
		});
	});
	describe.only("createDynamoTableProps", () => {
		it("should create ", () => {
			const expected = {
				Blog: ["mock Blog"],
				BlogPost: ["mock BlogPost"],
				Comment: ["mock Comment"],
			};
			const mockCurriedFunction = jest.fn();
			mock.createSingleDynamoTableProp.mockImplementation((name) => {
				return mockCurriedFunction.mockImplementationOnce(
					(schema) =>`mock ${name}`,
				);
			});
			const actual = underTest.createDynamoTableProps(testSchema);
			expect(actual).toEqual(expected);
		});
	});
	describe("getDynamoAttributeProps", () => {
		it("should get dynamo attribute props", () => {
			const {
				KeySchema,
				AttributeDefinitions,
			} = testSchema.stacks.Comment.Resources.CommentTable.Properties;
			const expected = {
				partitionKey: { name: "blogPostId", type: "S" },
				sortKey: { name: "commentId", type: "S" },
			};
			const actual = underTest.getDynamoAttributeProps(
				KeySchema,
				AttributeDefinitions,
			);
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
