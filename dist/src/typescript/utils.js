"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.naming = exports.createConstruct = exports.readFileSync = exports.getProps = exports.cast = void 0;
const fs_1 = require("fs");
const utils_1 = require("../providers/utils");
__exportStar(require("../providers/utils"), exports);
function cast(obj) {
    return obj;
}
exports.cast = cast;
function getProps(props) {
    return cast({});
}
exports.getProps = getProps;
// exported seperately for unit testing
const readFileSync = (path, encoding) => fs_1.readFileSync(path, encoding);
exports.readFileSync = readFileSync;
function createConstruct(scope, props, constructType, resourceName) {
    return utils_1.createConstruct(scope, props, constructType, resourceName);
}
exports.createConstruct = createConstruct;
const naming = (conventions, name) => {
    const result = conventions.reduce((acc, conventionCallback) => {
        const isCallback = typeof conventionCallback === 'function';
        const result = isCallback ? conventionCallback(acc) : acc;
        return result;
    }, name);
    console.info(result);
    return result;
};
exports.naming = naming;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdHlwZXNjcmlwdC91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsMkJBQXlEO0FBRXpELDhDQUEwRTtBQUcxRSxxREFBbUM7QUFFbkMsU0FBZ0IsSUFBSSxDQUFJLEdBQVk7SUFDbkMsT0FBTyxHQUFRLENBQUM7QUFDakIsQ0FBQztBQUZELG9CQUVDO0FBRUQsU0FBZ0IsUUFBUSxDQUFJLEtBQThCO0lBQ3pELE9BQU8sSUFBSSxDQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFGRCw0QkFFQztBQUVELHVDQUF1QztBQUNoQyxNQUFNLFlBQVksR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUcsRUFBRSxDQUFDLGlCQUFtQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUF4RSxRQUFBLFlBQVksZ0JBQTREO0FBRXJGLFNBQWdCLGVBQWUsQ0FBQyxLQUFpQixFQUFFLEtBQStCLEVBQUUsYUFBbUIsRUFBRSxZQUFxQjtJQUM3SCxPQUFPLHVCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFGRCwwQ0FFQztBQUVNLE1BQU0sTUFBTSxHQUFHLENBQUMsV0FBMkMsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUMzRSxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFDLGtCQUFrQixFQUFFLEVBQUU7UUFDNUQsTUFBTSxVQUFVLEdBQUcsT0FBTyxrQkFBa0IsS0FBSyxVQUFVLENBQUM7UUFDNUQsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzFELE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQixPQUFPLE1BQU0sQ0FBQztBQUNmLENBQUMsQ0FBQTtBQVJZLFFBQUEsTUFBTSxVQVFsQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElfQXBwU3luY0dxbFNjaGVtYVByb3BzLCBJX0NyZWF0ZUNvbnN0cnVjdENvbnRleHQgfSBmcm9tIFwiLi9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgYXMgcHJpdmF0ZVJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgeyBjcmVhdGVDb25zdHJ1Y3QgYXMgY3JlYXRlQ29uc3RydWN0SnMgfSBmcm9tICcuLi9wcm92aWRlcnMvdXRpbHMnO1xuaW1wb3J0IHsgc3RyaW5nMVRvMjU1IH0gZnJvbSBcImF3cy1zZGsvY2xpZW50cy9jdXN0b21lcnByb2ZpbGVzXCI7XG5cbmV4cG9ydCAqIGZyb20gJy4uL3Byb3ZpZGVycy91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXN0PFQ+KG9iajogdW5rbm93bik6IFQge1xuXHRyZXR1cm4gb2JqIGFzIFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9wczxUPihwcm9wczogSV9BcHBTeW5jR3FsU2NoZW1hUHJvcHMpOiBUIHtcblx0cmV0dXJuIGNhc3Q8VD4oe30pO1xufVxuXG4vLyBleHBvcnRlZCBzZXBlcmF0ZWx5IGZvciB1bml0IHRlc3RpbmdcbmV4cG9ydCBjb25zdCByZWFkRmlsZVN5bmMgPSAocGF0aCwgZW5jb2RpbmcpICA9PiBwcml2YXRlUmVhZEZpbGVTeW5jKHBhdGgsIGVuY29kaW5nKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbnN0cnVjdChzY29wZSA6IENvbnN0cnVjdCwgcHJvcHMgOiBJX0FwcFN5bmNHcWxTY2hlbWFQcm9wcywgY29uc3RydWN0VHlwZSA6IGFueSwgcmVzb3VyY2VOYW1lIDogc3RyaW5nKSB7IFxuXHRyZXR1cm4gY3JlYXRlQ29uc3RydWN0SnMoc2NvcGUsIHByb3BzLCBjb25zdHJ1Y3RUeXBlLCByZXNvdXJjZU5hbWUpO1xufVxuXG5leHBvcnQgY29uc3QgbmFtaW5nID0gKGNvbnZlbnRpb25zIDogKChuYW1lIDogc3RyaW5nKSA9PiBzdHJpbmcpW10sIG5hbWUpID0+IHtcblx0Y29uc3QgcmVzdWx0ID0gY29udmVudGlvbnMucmVkdWNlKChhY2MsY29udmVudGlvbkNhbGxiYWNrKSA9PiB7IFxuXHRcdGNvbnN0IGlzQ2FsbGJhY2sgPSB0eXBlb2YgY29udmVudGlvbkNhbGxiYWNrID09PSAnZnVuY3Rpb24nO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGlzQ2FsbGJhY2sgPyBjb252ZW50aW9uQ2FsbGJhY2soYWNjKSA6IGFjYztcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LCBuYW1lKTtcblx0Y29uc29sZS5pbmZvKHJlc3VsdCk7XG5cdHJldHVybiByZXN1bHQ7XG59Il19