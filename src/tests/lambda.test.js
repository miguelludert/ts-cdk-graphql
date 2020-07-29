import { curry } from "ramda";

// this is an experimental function to enable mocking within the same file as the invoked function
export const prepModule = name => {
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

describe("Lambda", () => {
	const { mock, underTest } = prepModule("../lambda");
	describe("getLambdaDataSources", () => {
		it("should make props for the datasource and resolvers", () => {
			const { options, expected, codegen } = jest.requireActual(
				"./fixtures/lambda.getLambdaDataSources.json",
			);
			mock.createLambdaDataSourceProps.mockImplementation(
				curry((optionsArg, codegenArg, datasourceArg) => {
					expect(optionsArg).toBe(options);
					expect(codegenArg).toBe(codegen);
					return { dataSourceProps: datasourceArg };
				}),
			);
			mock.createLambdaResolverProp.mockImplementation(
				curry((optionsArg, codegenArg, datasourceArg) => {
					expect(optionsArg).toBe(options);
					expect(codegenArg).toBe(codegen);
					return { resolverProp: datasourceArg };
				}),
			);
			const actual = underTest.getLambdaDataSources(options, codegen);
			expect(actual).toEqual(expected);
			expect(mock.createLambdaDataSourceProps).toHaveBeenCalledTimes(2);
			expect(mock.createLambdaResolverProp).toHaveBeenCalledTimes(2);
		});
	});
	describe("createLambdaDataSourceProps", () => {
		it("should create a set of props for a single data source", () => {
			const { expected, codegen, options, dataSourceName } = jest.requireActual(
				"./fixtures/lambda.createLambdaDataSourceProps.json",
			);
			const actual = underTest.createLambdaDataSourceProps(
				options,
				codegen,
				dataSourceName,
			);
			expect(actual).toEqual(expected);
		});
	});
	describe("createLambdaResolverProp", () => {
		it("should create a set of props for a single data source", () => {
			const { expected, codegen, options, dataSourceName } = jest.requireActual(
				"./fixtures/lambda.createLambdaResolverProps.json",
			);
			const actual = underTest.createLambdaResolverProp(
				options,
				codegen,
				dataSourceName,
			);
			expect(actual).toEqual(expected);
		});
	});
});
