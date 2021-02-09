"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepModule = void 0;
const testing_1 = __importDefault(require("../../testing"));
const constants_1 = require("../../constants");
const path_1 = require("path");
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
describe("utils", () => {
    const { mock, underTest } = exports.prepModule("../utils");
    describe.skip("filterDataSourcesOfType", () => {
        it("should find all stacks with datasources of a specified type (dynamo)", () => {
            const actual = filterDataSourcesOfType(testing_1.default, constants_1.AMAZON_DYNAMODB);
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
            class Dummy {
            }
            const stackName = "dummyLambdaFunction";
            const defaultsDirectory = "/defaultsDirectory";
            const overridesDirectory = "/overridesDirectory";
            const internalDefaultPath = path_1.join(__dirname, `../../defaults/Dummy`);
            const customDefaultPath = path_1.join(defaultsDirectory, "Dummy");
            const customOverridePath = path_1.join(overridesDirectory, stackName);
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
                state: 2
            };
            const thirdState = {
                state: 3
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdGVzdHMvdXRpbHMudGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBdUM7QUFDdkMsK0NBQWtEO0FBR2xELCtCQUE0QjtBQUc1QixrR0FBa0c7QUFDM0YsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtJQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2YsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTztRQUNOLElBQUk7UUFDSixTQUFTO0tBQ1QsQ0FBQztBQUNILENBQUMsQ0FBQztBQVhXLFFBQUEsVUFBVSxjQVdyQjtBQUVGLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLEdBQUcsa0JBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxRQUFRLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtRQUM3QyxFQUFFLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1lBQy9FLE1BQU0sTUFBTSxHQUFHLHVCQUF1QixDQUFDLGlCQUFVLEVBQUUsMkJBQWUsQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDdEMsRUFBRSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQztZQUM5QixNQUFNLEtBQUssR0FBRztnQkFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDbEIsV0FBVyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7YUFDdEIsQ0FBQztZQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7WUFDckMsNERBQTREO1lBQzVELHdEQUF3RDtZQUN4RCwwREFBMEQ7WUFFMUQsTUFBTSxLQUFLO2FBQUc7WUFDZCxNQUFNLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztZQUN4QyxNQUFNLGlCQUFpQixHQUFHLG9CQUFvQixDQUFDO1lBQy9DLE1BQU0sa0JBQWtCLEdBQUcscUJBQXFCLENBQUM7WUFDakQsTUFBTSxtQkFBbUIsR0FBRyxXQUFJLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFDcEUsTUFBTSxpQkFBaUIsR0FBRyxXQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDM0QsTUFBTSxrQkFBa0IsR0FBRyxXQUFJLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDL0QsTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNCLE9BQU8sRUFBRSxXQUFXLEdBQUcsRUFBRTtnQkFDekIsV0FBVyxFQUFFLGVBQWUsR0FBRyxFQUFFO2FBQ2pDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7Z0JBQ3JFLE9BQU8sRUFBRSxJQUFJO2FBQ2IsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtnQkFDakUsT0FBTyxFQUFFLElBQUk7YUFDYixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUNuRSxPQUFPLEVBQUUsSUFBSTthQUNiLENBQUMsQ0FBQztZQUNILE1BQU0sS0FBSyxHQUFHO2dCQUNiLGlCQUFpQjtnQkFDakIsa0JBQWtCO2dCQUNsQixRQUFRLEVBQUU7b0JBQ1QsS0FBSyxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDcEM7Z0JBQ0QsU0FBUyxFQUFFO29CQUNWLENBQUMsU0FBUyxDQUFDLEVBQUUsU0FBUyxDQUFDLG1CQUFtQixDQUFDO2lCQUMzQzthQUNELENBQUM7WUFDRixNQUFNLFFBQVEsR0FBRztnQkFDaEIsT0FBTyxFQUFFO29CQUNSLDBCQUEwQjtvQkFDMUIsd0JBQXdCO29CQUN4Qix5QkFBeUI7b0JBQ3pCLDBCQUEwQjtvQkFDMUIsMkJBQTJCO2lCQUMzQjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1osOEJBQThCO29CQUM5Qiw0QkFBNEI7b0JBQzVCLDZCQUE2QjtvQkFDN0IsOEJBQThCO29CQUM5QiwrQkFBK0I7aUJBQy9CO2FBQ0QsQ0FBQztZQUNGLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzlCLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7WUFDaEQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO1lBQ3RCLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQztZQUMxQixNQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDeEIsTUFBTSxXQUFXLEdBQUc7Z0JBQ25CLEtBQUssRUFBRyxDQUFDO2FBQ1QsQ0FBQztZQUNGLE1BQU0sVUFBVSxHQUFHO2dCQUNsQixLQUFLLEVBQUcsQ0FBQzthQUNULENBQUM7WUFDRixNQUFNLE9BQU8sR0FBRztnQkFDZixJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQztnQkFDdkMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO2FBQ3JDLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDaEUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdEUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztZQUN0QixNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7WUFDMUIsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDO1lBQzlCLE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0RCxTQUFTLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEUsTUFBTSxpQkFBaUIsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDckMsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ25CLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztZQUN0QixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbkIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO1lBQ3RCLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQztZQUNyQyxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUM7WUFDM0IsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDO1lBQ25DLE1BQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFDO1lBQ3hDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUM7Z0JBQzFDLE9BQU8sRUFBRSxXQUFXO2FBQ3BCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDbkYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDdkUsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNwRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdGVzdFNjaGVtYSBmcm9tIFwiLi4vLi4vdGVzdGluZ1wiO1xuaW1wb3J0IHsgQU1BWk9OX0RZTkFNT0RCIH0gZnJvbSBcIi4uLy4uL2NvbnN0YW50c1wiO1xuaW1wb3J0IGdyYXBoUUxBcGlDb25zdHJ1Y3RTZXR1cCBmcm9tIFwiLi4vLi4vZGVmYXVsdHMvR3JhcGhRTEFwaVwiO1xuaW1wb3J0IHsgR3JhcGhRTEFwaSB9IGZyb20gXCJAYXdzLWNkay9hd3MtYXBwc3luY1wiO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBoYXNVbmNhdWdodEV4Y2VwdGlvbkNhcHR1cmVDYWxsYmFjayB9IGZyb20gXCJwcm9jZXNzXCI7XG5cbi8vIHRoaXMgaXMgYW4gZXhwZXJpbWVudGFsIGZ1bmN0aW9uIHRvIGVuYWJsZSBtb2NraW5nIHdpdGhpbiB0aGUgc2FtZSBmaWxlIGFzIHRoZSBpbnZva2VkIGZ1bmN0aW9uXG5leHBvcnQgY29uc3QgcHJlcE1vZHVsZSA9IChuYW1lKSA9PiB7XG5cdGplc3QubW9jayhuYW1lKTtcblx0Y29uc3QgbW9jayA9IGplc3QucmVxdWlyZU1vY2sobmFtZSk7XG5cdGNvbnN0IHVuZGVyVGVzdCA9IGplc3QucmVxdWlyZUFjdHVhbChuYW1lKTtcblx0YmVmb3JlRWFjaCgoKSA9PiB7XG5cdFx0amVzdC5yZXNldEFsbE1vY2tzKCk7XG5cdH0pO1xuXHRyZXR1cm4ge1xuXHRcdG1vY2ssXG5cdFx0dW5kZXJUZXN0LFxuXHR9O1xufTtcblxuZGVzY3JpYmUoXCJ1dGlsc1wiLCAoKSA9PiB7XG5cdGNvbnN0IHsgbW9jaywgdW5kZXJUZXN0fSA9IHByZXBNb2R1bGUoXCIuLi91dGlsc1wiKTtcblx0ZGVzY3JpYmUuc2tpcChcImZpbHRlckRhdGFTb3VyY2VzT2ZUeXBlXCIsICgpID0+IHtcblx0XHRpdChcInNob3VsZCBmaW5kIGFsbCBzdGFja3Mgd2l0aCBkYXRhc291cmNlcyBvZiBhIHNwZWNpZmllZCB0eXBlIChkeW5hbW8pXCIsICgpID0+IHtcblx0XHRcdGNvbnN0IGFjdHVhbCA9IGZpbHRlckRhdGFTb3VyY2VzT2ZUeXBlKHRlc3RTY2hlbWEsIEFNQVpPTl9EWU5BTU9EQik7XG5cdFx0XHRjb25zdCBhY3R1YWxLZXlzID0gT2JqZWN0LmtleXMoYWN0dWFsKTtcblx0XHRcdGNvbnN0IGV4cGVjdGVkS2V5cyA9IFtcIkJsb2dcIiwgXCJCbG9nUG9zdFwiLCBcIkNvbW1lbnRcIl07XG5cdFx0XHRleHBlY3QoYWN0dWFsS2V5cykudG9FcXVhbChleHBlY3RlZEtleXMpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRkZXNjcmliZShcInJlcXVpcmVDb25zdHJ1Y3RTZXR1cFwiLCAoKSA9PiB7XG5cdFx0aXQoXCJzaG91bGQgYSBzZXR1cCBmaWxlIGJ5IHBhdGhcIiwgKCkgPT4ge1xuXHRcdFx0Y29uc3QgcGF0aCA9IFwiL3BhdGgvdG8vc2V0dXBcIjtcblx0XHRcdGNvbnN0IHNldHVwID0ge1xuXHRcdFx0XHRvblByb3BzOiBqZXN0LmZuKCksXG5cdFx0XHRcdG9uQ29uc3RydWN0OiBqZXN0LmZuKCksXG5cdFx0XHR9O1xuXHRcdFx0amVzdC5kb01vY2socGF0aCwgKCkgPT4gc2V0dXAsIHsgdmlydHVhbDogdHJ1ZSB9KTtcblx0XHRcdGNvbnN0IGFjdHVhbCA9IHVuZGVyVGVzdC5yZXF1aXJlQ29uc3RydWN0U2V0dXAocGF0aCk7XG5cdFx0XHRleHBlY3QoYWN0dWFsKS50b0VxdWFsKHNldHVwKTtcblx0XHR9KTtcblx0fSk7XG5cblx0ZGVzY3JpYmUoXCJnYXRoZXJDb25zdHJ1Y3RTZXR1cHNcIiwgKCkgPT4ge1xuXHRcdGl0KFwic2hvdWxkIG9yZ2FuaXplIGFsbCBzZXR1cHNcIiwgKCkgPT4ge1xuXHRcdFx0Ly8gY29uc3QgaW50ZXJuYWxEZWZhdWx0UGF0aCA9IFwiL3BhdGgvdG8vaW50ZXJuYWwvZGVmYXVsdHNcIjtcblx0XHRcdC8vIGNvbnN0IGN1c3RvbURlZmF1bHRQYXRoID0gXCIvcGF0aC90by9jdXN0b20vZGVmYXVsdHNcIjtcblx0XHRcdC8vIGNvbnN0IGN1c3RvbU92ZXJyaWRlUGF0aCA9IFwiL3BhdGgvdG8vY3VzdG9tL292ZXJyaWRlc1wiO1xuXG5cdFx0XHRjbGFzcyBEdW1teSB7fVxuXHRcdFx0Y29uc3Qgc3RhY2tOYW1lID0gXCJkdW1teUxhbWJkYUZ1bmN0aW9uXCI7XG5cdFx0XHRjb25zdCBkZWZhdWx0c0RpcmVjdG9yeSA9IFwiL2RlZmF1bHRzRGlyZWN0b3J5XCI7XG5cdFx0XHRjb25zdCBvdmVycmlkZXNEaXJlY3RvcnkgPSBcIi9vdmVycmlkZXNEaXJlY3RvcnlcIjtcblx0XHRcdGNvbnN0IGludGVybmFsRGVmYXVsdFBhdGggPSBqb2luKF9fZGlybmFtZSwgYC4uLy4uL2RlZmF1bHRzL0R1bW15YCk7XG5cdFx0XHRjb25zdCBjdXN0b21EZWZhdWx0UGF0aCA9IGpvaW4oZGVmYXVsdHNEaXJlY3RvcnksIFwiRHVtbXlcIik7XG5cdFx0XHRjb25zdCBjdXN0b21PdmVycmlkZVBhdGggPSBqb2luKG92ZXJyaWRlc0RpcmVjdG9yeSwgc3RhY2tOYW1lKTtcblx0XHRcdGNvbnN0IG1ha2VTZXR1cCA9IChhcmcpID0+ICh7XG5cdFx0XHRcdG9uUHJvcHM6IGBvblByb3BzICR7YXJnfWAsXG5cdFx0XHRcdG9uQ29uc3RydWN0OiBgb25Db25zdHJ1Y3QgJHthcmd9YCxcblx0XHRcdH0pO1xuXHRcdFx0amVzdC5kb01vY2soaW50ZXJuYWxEZWZhdWx0UGF0aCwgKCkgPT4gbWFrZVNldHVwKFwiaW50ZXJuYWwgZGVmYXVsdFwiKSwge1xuXHRcdFx0XHR2aXJ0dWFsOiB0cnVlLFxuXHRcdFx0fSk7XG5cdFx0XHRqZXN0LmRvTW9jayhjdXN0b21EZWZhdWx0UGF0aCwgKCkgPT4gbWFrZVNldHVwKFwiY3VzdG9tIGRlZmF1bHRcIiksIHtcblx0XHRcdFx0dmlydHVhbDogdHJ1ZSxcblx0XHRcdH0pO1xuXHRcdFx0amVzdC5kb01vY2soY3VzdG9tT3ZlcnJpZGVQYXRoLCAoKSA9PiBtYWtlU2V0dXAoXCJjdXN0b20gb3ZlcnJpZGVcIiksIHtcblx0XHRcdFx0dmlydHVhbDogdHJ1ZSxcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgcHJvcHMgPSB7XG5cdFx0XHRcdGRlZmF1bHRzRGlyZWN0b3J5LFxuXHRcdFx0XHRvdmVycmlkZXNEaXJlY3RvcnksXG5cdFx0XHRcdGRlZmF1bHRzOiB7XG5cdFx0XHRcdFx0RHVtbXk6IG1ha2VTZXR1cChcImluamVjdGVkIGRlZmF1bHRcIiksXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG92ZXJyaWRlczoge1xuXHRcdFx0XHRcdFtzdGFja05hbWVdOiBtYWtlU2V0dXAoXCJpbmplY3RlZCBvdmVycmlkZVwiKSxcblx0XHRcdFx0fSxcblx0XHRcdH07XG5cdFx0XHRjb25zdCBleHBlY3RlZCA9IHtcblx0XHRcdFx0b25Qcm9wczogW1xuXHRcdFx0XHRcdFwib25Qcm9wcyBpbnRlcm5hbCBkZWZhdWx0XCIsXG5cdFx0XHRcdFx0XCJvblByb3BzIGN1c3RvbSBkZWZhdWx0XCIsXG5cdFx0XHRcdFx0XCJvblByb3BzIGN1c3RvbSBvdmVycmlkZVwiLFxuXHRcdFx0XHRcdFwib25Qcm9wcyBpbmplY3RlZCBkZWZhdWx0XCIsXG5cdFx0XHRcdFx0XCJvblByb3BzIGluamVjdGVkIG92ZXJyaWRlXCIsXG5cdFx0XHRcdF0sXG5cdFx0XHRcdG9uQ29uc3RydWN0OiBbXG5cdFx0XHRcdFx0XCJvbkNvbnN0cnVjdCBpbnRlcm5hbCBkZWZhdWx0XCIsXG5cdFx0XHRcdFx0XCJvbkNvbnN0cnVjdCBjdXN0b20gZGVmYXVsdFwiLFxuXHRcdFx0XHRcdFwib25Db25zdHJ1Y3QgY3VzdG9tIG92ZXJyaWRlXCIsXG5cdFx0XHRcdFx0XCJvbkNvbnN0cnVjdCBpbmplY3RlZCBkZWZhdWx0XCIsXG5cdFx0XHRcdFx0XCJvbkNvbnN0cnVjdCBpbmplY3RlZCBvdmVycmlkZVwiLFxuXHRcdFx0XHRdLFxuXHRcdFx0fTtcblx0XHRcdGNvbnN0IGFjdHVhbCA9IHVuZGVyVGVzdC5nYXRoZXJDb25zdHJ1Y3RTZXR1cHMocHJvcHMsIER1bW15LCBzdGFja05hbWUpO1xuXHRcdFx0ZXhwZWN0KGFjdHVhbCkudG9FcXVhbChleHBlY3RlZCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGRlc2NyaWJlKFwiaW52b2tlT25Qcm9wc1wiLCAoKSA9PiB7XG5cdFx0aXQoXCJzaG91bGQgaW52b2tlIGEgc2V0IG9mIHByb3AgY2FsbGJhY2tzXCIsICgpID0+IHtcblx0XHRcdGNvbnN0IHNjb3BlID0gXCJzY29wZVwiO1xuXHRcdFx0Y29uc3QgY29udGV4dCA9IFwiY29udGV4dFwiO1xuXHRcdFx0Y29uc3QgaW5pdGlhbFN0YXRlID0ge307XG5cdFx0XHRjb25zdCBzZWNvbmRTdGF0ZSA9IHtcblx0XHRcdFx0c3RhdGUgOiAyXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgdGhpcmRTdGF0ZSA9IHtcblx0XHRcdFx0c3RhdGUgOiAzXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3Qgb25Qcm9wcyA9IFtcblx0XHRcdFx0amVzdC5mbigpLm1vY2tSZXR1cm5WYWx1ZShpbml0aWFsU3RhdGUpLFxuXHRcdFx0XHRqZXN0LmZuKCkubW9ja1JldHVyblZhbHVlKHNlY29uZFN0YXRlKSxcblx0XHRcdFx0amVzdC5mbigpLm1vY2tSZXR1cm5WYWx1ZSh0aGlyZFN0YXRlKSxcblx0XHRcdF07XG5cdFx0XHRjb25zdCBhY3R1YWwgPSB1bmRlclRlc3QuaW52b2tlT25Qcm9wcyhzY29wZSwgb25Qcm9wcywgY29udGV4dCk7XG5cdFx0XHRleHBlY3Qob25Qcm9wc1swXSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoc2NvcGUsIG51bGwsIGNvbnRleHQpO1xuXHRcdFx0ZXhwZWN0KG9uUHJvcHNbMV0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHNjb3BlLCBpbml0aWFsU3RhdGUsIGNvbnRleHQpO1xuXHRcdFx0ZXhwZWN0KG9uUHJvcHNbMl0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHNjb3BlLCBzZWNvbmRTdGF0ZSwgY29udGV4dCk7XG5cdFx0XHRleHBlY3QoYWN0dWFsKS50b0VxdWFsKHRoaXJkU3RhdGUpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRkZXNjcmliZShcImludm9rZU9uQ29uc3RydWN0XCIsICgpID0+IHtcblx0XHRpdChcInNob3VsZCBpbnZva2UgYSBzZXQgb2YgY29uc3RydWN0IGNhbGxiYWNrc1wiLCAoKSA9PiB7XG5cdFx0XHRjb25zdCBzY29wZSA9IFwic2NvcGVcIjtcblx0XHRcdGNvbnN0IGNvbnRleHQgPSBcImNvbnRleHRcIjtcblx0XHRcdGNvbnN0IGNvbnN0cnVjdCA9IFwiY29uc3RydWN0XCI7XG5cdFx0XHRjb25zdCBvbkNvbnN0cnVjdCA9IFtqZXN0LmZuKCksIGplc3QuZm4oKSwgamVzdC5mbigpXTtcblx0XHRcdHVuZGVyVGVzdC5pbnZva2VPbkNvbnN0cnVjdChzY29wZSwgY29uc3RydWN0LCBvbkNvbnN0cnVjdCwgY29udGV4dCk7XG5cdFx0XHR0aHJvdyBcIm5vdCBpbXBsZW1lbnRlZFwiO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRkZXNjcmliZS5vbmx5KFwiY3JlYXRlQ29uc3RydWN0XCIsICgpID0+IHtcblx0XHRpdChcInNob3VsZCBpbnN0YW50aWF0ZSBhIGNvbnN0cnVjdFwiLCAoKSA9PiB7XG5cdFx0XHRjb25zdCBEdW1teSA9IGplc3QuZm4oKTtcblx0XHRcdGNvbnN0IHR5cGUgPSBEdW1teTtcblx0XHRcdGNvbnN0IHNjb3BlID0gXCJzY29wZVwiO1xuXHRcdFx0Y29uc3QgY29udGV4dCA9IHt9O1xuXHRcdFx0Y29uc3QgcHJvcHMgPSBcInByb3BzXCI7XG5cdFx0XHRjb25zdCByZXNvdXJjZU5hbWUgPSBcInJlc291cmNlLW5hbWVcIjtcblx0XHRcdGNvbnN0IG9uUHJvcHMgPSBcIm9uIHByb3BzXCI7IFxuXHRcdFx0Y29uc3Qgb25Db25zdHJ1Y3QgPSBcIm9uIGNvbnN0cnVjdFwiO1xuXHRcdFx0Y29uc3Qgb25Qcm9wc1Jlc3VsdCA9IFwib24gcHJvcHMgcmVzdWx0XCI7XG5cdFx0XHRtb2NrLmdhdGhlckNvbnN0cnVjdFNldHVwcy5tb2NrUmV0dXJuVmFsdWUoe1xuXHRcdFx0XHRvblByb3BzLCBvbkNvbnN0cnVjdFxuXHRcdFx0fSk7XG5cdFx0XHRtb2NrLmludm9rZU9uUHJvcHMubW9ja1JldHVyblZhbHVlKG9uUHJvcHNSZXN1bHQpO1xuXHRcdFx0Y29uc3QgYWN0dWFsID0gdW5kZXJUZXN0LmNyZWF0ZUNvbnN0cnVjdChzY29wZSwgcHJvcHMsIHR5cGUsIHJlc291cmNlTmFtZSk7XG5cdFx0XHRleHBlY3QobW9jay5nYXRoZXJDb25zdHJ1Y3RTZXR1cHMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHByb3BzLCB0eXBlLCByZXNvdXJjZU5hbWUpO1xuXHRcdFx0ZXhwZWN0KER1bW15KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChzY29wZSwgcmVzb3VyY2VOYW1lLCBvblByb3BzUmVzdWx0KTtcblx0XHRcdGV4cGVjdChtb2NrLmludm9rZU9uQ29uc3RydWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChzY29wZSwgZXhwZWN0LmFueShEdW1teSksIG9uQ29uc3RydWN0LCBjb250ZXh0KTtcblx0XHRcdGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoZXhwZWN0LmFueShEdW1teSkpO1xuXHRcdH0pO1xuXHR9KTtcbn0pOyJdfQ==