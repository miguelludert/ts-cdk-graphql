import testSchema from "../../testing";
import { AMAZON_DYNAMODB } from "../../constants";
import graphQLApiConstructSetup from "../../defaults/GraphQLApi";
import { GraphQLApi } from "@aws-cdk/aws-appsync";
import { join } from "path";
import { hasUncaughtExceptionCaptureCallback } from "process";

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

describe("utils", () => {
	const { mock, underTest} = prepModule("../utils");
	describe.skip("filterDataSourcesOfType", () => {
		it("should find all stacks with datasources of a specified type (dynamo)", () => {
			const actual = filterDataSourcesOfType(testSchema, AMAZON_DYNAMODB);
			const actualKeys = Object.keys(actual);
			const expectedKeys = ["Blog", "BlogPost", "Comment"];
			expect(actualKeys).toEqual(expectedKeys);
		});
	});

	describe("requireConstructSetup", () => {
		it("should a setup file by path", () => {
			const path = "/path/to/setup";
			const setup = {
				onProps: jest.fn(),
				onConstruct: jest.fn(),
			};
			jest.doMock(path, () => setup, { virtual: true });
			const actual = underTest.requireConstructSetup(path);
			expect(actual).toEqual(setup);
		});
	});

	describe("gatherConstructSetups", () => {
		it("should organize all setups", () => {
			// const internalDefaultPath = "/path/to/internal/defaults";
			// const customDefaultPath = "/path/to/custom/defaults";
			// const customOverridePath = "/path/to/custom/overrides";

			class Dummy {}
			const stackName = "dummyLambdaFunction";
			const defaultsDirectory = "/defaultsDirectory";
			const overridesDirectory = "/overridesDirectory";
			const internalDefaultPath = join(__dirname, `../../defaults/Dummy`);
			const customDefaultPath = join(defaultsDirectory, "Dummy");
			const customOverridePath = join(overridesDirectory, stackName);
			const makeSetup = (arg) => ({
				onProps: `onProps ${arg}`,
				onConstruct: `onConstruct ${arg}`,
			});
			jest.doMock(internalDefaultPath, () => makeSetup("internal default"), {
				virtual: true,
			});
			jest.doMock(customDefaultPath, () => makeSetup("custom default"), {
				virtual: true,
			});
			jest.doMock(customOverridePath, () => makeSetup("custom override"), {
				virtual: true,
			});
			const props = {
				defaultsDirectory,
				overridesDirectory,
				defaults: {
					Dummy: makeSetup("injected default"),
				},
				overrides: {
					[stackName]: makeSetup("injected override"),
				},
			};
			const expected = {
				onProps: [
					"onProps internal default",
					"onProps custom default",
					"onProps custom override",
					"onProps injected default",
					"onProps injected override",
				],
				onConstruct: [
					"onConstruct internal default",
					"onConstruct custom default",
					"onConstruct custom override",
					"onConstruct injected default",
					"onConstruct injected override",
				],
			};
			const actual = underTest.gatherConstructSetups(props, Dummy, stackName);
			expect(actual).toEqual(expected);
		});
	});

	describe("invokeOnProps", () => {
		it("should invoke a set of prop callbacks", () => {
			const scope = "scope";
			const context = "context";
			const initialState = {};
			const secondState = {
				state : 2
			};
			const thirdState = {
				state : 3
			};
			const onProps = [
				jest.fn().mockReturnValue(initialState),
				jest.fn().mockReturnValue(secondState),
				jest.fn().mockReturnValue(thirdState),
			];
			const actual = underTest.invokeOnProps(scope, onProps, context);
			expect(onProps[0]).toHaveBeenCalledWith(scope, null, context);
			expect(onProps[1]).toHaveBeenCalledWith(scope, initialState, context);
			expect(onProps[2]).toHaveBeenCalledWith(scope, secondState, context);
			expect(actual).toEqual(thirdState);
		});
	});

	describe("invokeOnConstruct", () => {
		it("should invoke a set of construct callbacks", () => {
			const scope = "scope";
			const context = "context";
			const construct = "construct";
			const onConstruct = [jest.fn(), jest.fn(), jest.fn()];
			underTest.invokeOnConstruct(scope, construct, onConstruct, context);
			throw "not implemented";
		});
	});

	describe.only("createConstruct", () => {
		it("should instantiate a construct", () => {
			const Dummy = jest.fn();
			const type = Dummy;
			const scope = "scope";
			const context = {};
			const props = "props";
			const resourceName = "resource-name";
			const onProps = "on props"; 
			const onConstruct = "on construct";
			const onPropsResult = "on props result";
			mock.gatherConstructSetups.mockReturnValue({
				onProps, onConstruct
			});
			mock.invokeOnProps.mockReturnValue(onPropsResult);
			const actual = underTest.createConstruct(scope, props, type, resourceName);
			expect(mock.gatherConstructSetups).toHaveBeenCalledWith(props, type, resourceName);
			expect(Dummy).toHaveBeenCalledWith(scope, resourceName, onPropsResult);
			expect(mock.invokeOnConstruct).toHaveBeenCalledWith(scope, expect.any(Dummy), onConstruct, context);
			expect(actual).toEqual(expect.any(Dummy));
		});
	});
});