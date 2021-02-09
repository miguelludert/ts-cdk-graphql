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
exports.addSuffix = exports.dump = exports.info = exports.getDatasourceCfn = exports.invokeOnConstruct = exports.invokeOnProps = exports.gatherConstructSetups = exports.createConstruct = exports.gatherStacks = exports.filterResourcePairsByType = exports.findStack = void 0;
const constants_1 = require("../constants");
const ramda_1 = require("ramda");
const self = __importStar(require("./utils"));
const change_case_1 = require("change-case");
const constants_2 = require("../constants");
const defaultSetup = __importStar(require("./default-setup"));
const findStack = (cfSchema, stackName) => {
    return cfSchema.stacks[stackName];
};
exports.findStack = findStack;
const filterResourcePairsByType = (resourcePairs, type) => {
    return resourcePairs.filter(([, resource]) => resource.Type === type);
};
exports.filterResourcePairsByType = filterResourcePairsByType;
const gatherStacks = (cfSchema) => {
    return ramda_1.toPairs(cfSchema.stackMapping).reduce((acc, [name, stackName]) => {
        if (!acc[stackName]) {
            acc[stackName] = {};
        }
        acc[stackName][name] = cfSchema.stacks[name];
    }, {});
};
exports.gatherStacks = gatherStacks;
const createConstruct = (scope, props, constructType, resourceName) => {
    exports.info("createConstruct");
    const { baseName, onProps, onConstruct } = self.gatherConstructSetups(props, constructType);
    const name = typeof props.namingConvention === "function"
        ? props.namingConvention(resourceName, baseName)
        : change_case_1.paramCase(`${resourceName}-${baseName}`);
    const context = {
        props,
        name,
        baseName,
        resourceName,
    };
    const constructProps = self.invokeOnProps(scope, onProps, context);
    const construct = new constructType(scope, name, constructProps);
    self.invokeOnConstruct(scope, construct, onConstruct, context);
    return construct;
};
exports.createConstruct = createConstruct;
function gatherConstructSetups(props, type) {
    const { name: typeName } = type;
    const setupName = `${change_case_1.camelCase(typeName)}Setup`;
    const setup = defaultSetup[setupName];
    const baseName = setup.baseName || typeName;
    const setups = [setup];
    if (props.defaults && props.defaults[typeName]) {
        setups.push(props.defaults[typeName]);
    }
    // if (props.overrides && props.overrides[resourceName]) {
    // 	setups.push(props.overrides[resourceName]);
    // }
    return setups.reduce((acc, setup) => {
        if (setup) {
            if (setup.onProps) {
                acc.onProps = [...acc.onProps, setup.onProps];
            }
            if (setup.onConstruct) {
                acc.onConstruct = [...acc.onConstruct, setup.onConstruct];
            }
        }
        return acc;
    }, {
        baseName,
        onProps: [],
        onConstruct: [],
    });
}
exports.gatherConstructSetups = gatherConstructSetups;
function invokeOnProps(scope, onProps, context) {
    exports.info("invokeOnProps");
    let props = null;
    onProps.forEach((callback) => {
        props = callback(scope, props, context);
        if (!props) {
            throw constants_1.INVOKE_ON_PROPS_ERROR_MESSAGE;
        }
    });
    return props;
}
exports.invokeOnProps = invokeOnProps;
function invokeOnConstruct(scope, construct, onConstruct, context) {
    exports.info("invokeOnConstruct");
    onConstruct.forEach((callback) => {
        callback(scope, construct, context);
    });
}
exports.invokeOnConstruct = invokeOnConstruct;
exports.getDatasourceCfn = ramda_1.curry((datasourceType, cfnSchema) => {
    // get dynamo resources by stack
    const result = Object.entries(cfnSchema.stacks).reduce((acc, [stackName, stackCfn]) => {
        const resourcePairs = Object.entries(stackCfn.Resources);
        const datasourcePairs = resourcePairs.find(([resourceName, resourceCfn]) => {
            const isDatasource = resourceCfn.Type === constants_2.RESOURCE_TYPE_DATASOURCE;
            const isDynamo = resourceCfn.Properties.Type === datasourceType;
            return isDatasource && isDynamo;
        });
        if (datasourcePairs) {
            const [datasourceName, datasourceCfn] = datasourcePairs;
            acc.push({
                stackName,
                resourcePairs,
                datasourceName,
                datasourceCfn,
            });
        }
        return acc;
    }, []);
    return result;
});
const info = (...args) => console.info(...args);
exports.info = info;
const dump = (...args) => {
    const dumpJson = (o) => {
        let result;
        try {
            result = JSON.stringify(o, null, 2);
        }
        catch (e) {
            result = o;
        }
        return `*\t${result}`;
    };
    const toConsole = args.map(dumpJson).join("\n");
    console.info(toConsole);
};
exports.dump = dump;
exports.addSuffix = ramda_1.curry((suffix, str) => str.endsWith(suffix) ? str : `${str}${suffix}`);
global.dump = exports.dump;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBNkQ7QUFFN0QsaUNBQTZDO0FBQzdDLDhDQUFnQztBQUNoQyw2Q0FBK0Q7QUFDL0QsNENBQXdEO0FBQ3hELDhEQUFnRDtBQUd6QyxNQUFNLFNBQVMsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRTtJQUNoRCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkMsQ0FBQyxDQUFDO0FBRlcsUUFBQSxTQUFTLGFBRXBCO0FBRUssTUFBTSx5QkFBeUIsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUNoRSxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7QUFDdkUsQ0FBQyxDQUFDO0FBRlcsUUFBQSx5QkFBeUIsNkJBRXBDO0FBRUssTUFBTSxZQUFZLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtJQUN4QyxPQUFPLGVBQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUU7UUFDdkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNwQixHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1IsQ0FB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QUUsQ0FDOUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxNQUFNLEVBQUUsQ0FDOUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFJLEdBQUcsWUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU5WT0tFX09OX1BST1BTX0VSUk9SX01FU1NBR0UgfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGN1cnJ5LCB0b1BhaXJzLCBwaXBlIH0gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgKiBhcyBzZWxmIGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBwYXNjYWxDYXNlLCBjYW1lbENhc2UsIHBhcmFtQ2FzZSB9IGZyb20gXCJjaGFuZ2UtY2FzZVwiO1xuaW1wb3J0IHsgUkVTT1VSQ0VfVFlQRV9EQVRBU09VUkNFIH0gZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xuaW1wb3J0ICogYXMgZGVmYXVsdFNldHVwIGZyb20gXCIuL2RlZmF1bHQtc2V0dXBcIjtcbmltcG9ydCB7IFN5bmNVdGlscyB9IGZyb20gXCJncmFwaHFsLXRyYW5zZm9ybWVyLWNvcmVcIjtcblxuZXhwb3J0IGNvbnN0IGZpbmRTdGFjayA9IChjZlNjaGVtYSwgc3RhY2tOYW1lKSA9PiB7XG5cdHJldHVybiBjZlNjaGVtYS5zdGFja3Nbc3RhY2tOYW1lXTtcbn07XG5cbmV4cG9ydCBjb25zdCBmaWx0ZXJSZXNvdXJjZVBhaXJzQnlUeXBlID0gKHJlc291cmNlUGFpcnMsIHR5cGUpID0+IHtcblx0cmV0dXJuIHJlc291cmNlUGFpcnMuZmlsdGVyKChbLCByZXNvdXJjZV0pID0+IHJlc291cmNlLlR5cGUgPT09IHR5cGUpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdhdGhlclN0YWNrcyA9IChjZlNjaGVtYSkgPT4ge1xuXHRyZXR1cm4gdG9QYWlycyhjZlNjaGVtYS5zdGFja01hcHBpbmcpLnJlZHVjZSgoYWNjLCBbbmFtZSwgc3RhY2tOYW1lXSkgPT4ge1xuXHRcdGlmICghYWNjW3N0YWNrTmFtZV0pIHtcblx0XHRcdGFjY1tzdGFja05hbWVdID0ge307XG5cdFx0fVxuXHRcdGFjY1tzdGFja05hbWVdW25hbWVdID0gY2ZTY2hlbWEuc3RhY2tzW25hbWVdO1xuXHR9LCB7fSk7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQ29uc3RydWN0ID0gKHNjb3BlLCBwcm9wcywgY29uc3RydWN0VHlwZSwgcmVzb3VyY2VOYW1lKSA9PiB7XG5cdGluZm8oXCJjcmVhdGVDb25zdHJ1Y3RcIik7XG5cdGNvbnN0IHsgYmFzZU5hbWUsIG9uUHJvcHMsIG9uQ29uc3RydWN0IH0gPSBzZWxmLmdhdGhlckNvbnN0cnVjdFNldHVwcyhcblx0XHRwcm9wcyxcblx0XHRjb25zdHJ1Y3RUeXBlLFxuXHQpO1xuXHRjb25zdCBuYW1lID1cblx0XHR0eXBlb2YgcHJvcHMubmFtaW5nQ29udmVudGlvbiA9PT0gXCJmdW5jdGlvblwiXG5cdFx0XHQ/IHByb3BzLm5hbWluZ0NvbnZlbnRpb24ocmVzb3VyY2VOYW1lLCBiYXNlTmFtZSlcblx0XHRcdDogcGFyYW1DYXNlKGAke3Jlc291cmNlTmFtZX0tJHtiYXNlTmFtZX1gKTtcblxuXHRjb25zdCBjb250ZXh0ID0ge1xuXHRcdHByb3BzLFxuXHRcdG5hbWUsXG5cdFx0YmFzZU5hbWUsXG5cdFx0cmVzb3VyY2VOYW1lLFxuXHR9O1xuXHRjb25zdCBjb25zdHJ1Y3RQcm9wcyA9IHNlbGYuaW52b2tlT25Qcm9wcyhzY29wZSwgb25Qcm9wcywgY29udGV4dCk7XG5cdGNvbnN0IGNvbnN0cnVjdCA9IG5ldyBjb25zdHJ1Y3RUeXBlKHNjb3BlLCBuYW1lLCBjb25zdHJ1Y3RQcm9wcyk7XG5cdHNlbGYuaW52b2tlT25Db25zdHJ1Y3Qoc2NvcGUsIGNvbnN0cnVjdCwgb25Db25zdHJ1Y3QsIGNvbnRleHQpO1xuXHRyZXR1cm4gY29uc3RydWN0O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdhdGhlckNvbnN0cnVjdFNldHVwcyhwcm9wcywgdHlwZSkge1xuXHRjb25zdCB7IG5hbWU6IHR5cGVOYW1lIH0gPSB0eXBlO1xuXHRjb25zdCBzZXR1cE5hbWUgPSBgJHtjYW1lbENhc2UodHlwZU5hbWUpfVNldHVwYDtcblx0Y29uc3Qgc2V0dXAgPSBkZWZhdWx0U2V0dXBbc2V0dXBOYW1lXTtcblx0Y29uc3QgYmFzZU5hbWUgPSBzZXR1cC5iYXNlTmFtZSB8fCB0eXBlTmFtZTtcblx0Y29uc3Qgc2V0dXBzID0gW3NldHVwXTtcblxuXHRpZiAocHJvcHMuZGVmYXVsdHMgJiYgcHJvcHMuZGVmYXVsdHNbdHlwZU5hbWVdKSB7XG5cdFx0c2V0dXBzLnB1c2gocHJvcHMuZGVmYXVsdHNbdHlwZU5hbWVdKTtcblx0fVxuXG5cdC8vIGlmIChwcm9wcy5vdmVycmlkZXMgJiYgcHJvcHMub3ZlcnJpZGVzW3Jlc291cmNlTmFtZV0pIHtcblx0Ly8gXHRzZXR1cHMucHVzaChwcm9wcy5vdmVycmlkZXNbcmVzb3VyY2VOYW1lXSk7XG5cdC8vIH1cblxuXHRyZXR1cm4gc2V0dXBzLnJlZHVjZShcblx0XHQoYWNjLCBzZXR1cCkgPT4ge1xuXHRcdFx0aWYgKHNldHVwKSB7XG5cdFx0XHRcdGlmIChzZXR1cC5vblByb3BzKSB7XG5cdFx0XHRcdFx0YWNjLm9uUHJvcHMgPSBbLi4uYWNjLm9uUHJvcHMsIHNldHVwLm9uUHJvcHNdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzZXR1cC5vbkNvbnN0cnVjdCkge1xuXHRcdFx0XHRcdGFjYy5vbkNvbnN0cnVjdCA9IFsuLi5hY2Mub25Db25zdHJ1Y3QsIHNldHVwLm9uQ29uc3RydWN0XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFjYztcblx0XHR9LFxuXHRcdHtcblx0XHRcdGJhc2VOYW1lLFxuXHRcdFx0b25Qcm9wczogW10sXG5cdFx0XHRvbkNvbnN0cnVjdDogW10sXG5cdFx0fSxcblx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZU9uUHJvcHMoc2NvcGUsIG9uUHJvcHMsIGNvbnRleHQpIHtcblx0aW5mbyhcImludm9rZU9uUHJvcHNcIik7XG5cdGxldCBwcm9wcyA9IG51bGw7XG5cdG9uUHJvcHMuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcblx0XHRwcm9wcyA9IGNhbGxiYWNrKHNjb3BlLCBwcm9wcywgY29udGV4dCk7XG5cdFx0aWYgKCFwcm9wcykge1xuXHRcdFx0dGhyb3cgSU5WT0tFX09OX1BST1BTX0VSUk9SX01FU1NBR0U7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHByb3BzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlT25Db25zdHJ1Y3Qoc2NvcGUsIGNvbnN0cnVjdCwgb25Db25zdHJ1Y3QsIGNvbnRleHQpIHtcblx0aW5mbyhcImludm9rZU9uQ29uc3RydWN0XCIpO1xuXHRvbkNvbnN0cnVjdC5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuXHRcdGNhbGxiYWNrKHNjb3BlLCBjb25zdHJ1Y3QsIGNvbnRleHQpO1xuXHR9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldERhdGFzb3VyY2VDZm4gPSBjdXJyeSgoZGF0YXNvdXJjZVR5cGUsIGNmblNjaGVtYSkgPT4ge1xuXHQvLyBnZXQgZHluYW1vIHJlc291cmNlcyBieSBzdGFja1xuXHRjb25zdCByZXN1bHQgPSBPYmplY3QuZW50cmllcyhjZm5TY2hlbWEuc3RhY2tzKS5yZWR1Y2UoXG5cdFx0KGFjYywgW3N0YWNrTmFtZSwgc3RhY2tDZm5dKSA9PiB7XG5cdFx0XHRjb25zdCByZXNvdXJjZVBhaXJzID0gT2JqZWN0LmVudHJpZXMoc3RhY2tDZm4uUmVzb3VyY2VzKTtcblx0XHRcdGNvbnN0IGRhdGFzb3VyY2VQYWlycyA9IHJlc291cmNlUGFpcnMuZmluZChcblx0XHRcdFx0KFtyZXNvdXJjZU5hbWUsIHJlc291cmNlQ2ZuXSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGlzRGF0YXNvdXJjZSA9IHJlc291cmNlQ2ZuLlR5cGUgPT09IFJFU09VUkNFX1RZUEVfREFUQVNPVVJDRTtcblx0XHRcdFx0XHRjb25zdCBpc0R5bmFtbyA9IHJlc291cmNlQ2ZuLlByb3BlcnRpZXMuVHlwZSA9PT0gZGF0YXNvdXJjZVR5cGU7XG5cdFx0XHRcdFx0cmV0dXJuIGlzRGF0YXNvdXJjZSAmJiBpc0R5bmFtbztcblx0XHRcdFx0fSxcblx0XHRcdCk7XG5cdFx0XHRpZiAoZGF0YXNvdXJjZVBhaXJzKSB7XG5cdFx0XHRcdGNvbnN0IFtkYXRhc291cmNlTmFtZSwgZGF0YXNvdXJjZUNmbl0gPSBkYXRhc291cmNlUGFpcnM7XG5cdFx0XHRcdGFjYy5wdXNoKHtcblx0XHRcdFx0XHRzdGFja05hbWUsXG5cdFx0XHRcdFx0cmVzb3VyY2VQYWlycyxcblx0XHRcdFx0XHRkYXRhc291cmNlTmFtZSxcblx0XHRcdFx0XHRkYXRhc291cmNlQ2ZuLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSxcblx0XHRbXSxcblx0KTtcblx0cmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5leHBvcnQgY29uc3QgaW5mbyA9ICguLi5hcmdzKSA9PiBjb25zb2xlLmluZm8oLi4uYXJncyk7XG5cbmV4cG9ydCBjb25zdCBkdW1wID0gKC4uLmFyZ3MpID0+IHtcblx0Y29uc3QgZHVtcEpzb24gPSAobykgPT4ge1xuXHRcdGxldCByZXN1bHQ7XG5cdFx0dHJ5IHtcblx0XHRcdHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KG8sIG51bGwsIDIpO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHJlc3VsdCA9IG87XG5cdFx0fVxuXHRcdHJldHVybiBgKlxcdCR7cmVzdWx0fWA7XG5cdH07XG5cdGNvbnN0IHRvQ29uc29sZSA9IGFyZ3MubWFwKGR1bXBKc29uKS5qb2luKFwiXFxuXCIpO1xuXHRjb25zb2xlLmluZm8odG9Db25zb2xlKTtcbn07XG5leHBvcnQgY29uc3QgYWRkU3VmZml4ID0gY3VycnkoKHN1ZmZpeCwgc3RyKSA9PlxuXHRzdHIuZW5kc1dpdGgoc3VmZml4KSA/IHN0ciA6IGAke3N0cn0ke3N1ZmZpeH1gLFxuKTtcblxuZ2xvYmFsLmR1bXAgPSBkdW1wO1xuIl19