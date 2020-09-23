import testSchema from "./test-schema";
import {
	filterDataSourcesOfType,
	requireConstructSetup,
	gatherConstructSetups,
} from "../datasource-utils";
import { AMAZON_DYNAMODB } from "../../constants";
import graphQLApiConstructSetup from "../../defaults/GraphQLApi";
import { GraphQLApi } from "@aws-cdk/aws-appsync";
import { join } from "path";

describe("datasource-utils", () => {
	describe("filterDataSourcesOfType", () => {
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
			const actual = requireConstructSetup(path);
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
			const actual = gatherConstructSetups(props, Dummy, stackName);
			expect(actual).toEqual(expected);
		});
	});

	describe("no implemented", () => {
		throw "no implemented";
	});
});
