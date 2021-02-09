"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSchema = exports.prepModule = exports.dump = void 0;
const test_schema_json_1 = __importDefault(require("./test-schema.json"));
exports.testSchema = test_schema_json_1.default;
const dump = (obj) => console.info(JSON.stringify(obj, null, 2));
exports.dump = dump;
// this is an experimental function to enable mocking within the same file as the invoked function
const prepModule = name => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdGluZy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwRUFBNkM7QUFtQnBDLHFCQW5CRCwwQkFBVSxDQW1CQztBQWhCWixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUEzRCxRQUFBLElBQUksUUFBdUQ7QUFFeEUsa0dBQWtHO0FBQzNGLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFO0lBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPO1FBQ04sSUFBSTtRQUNKLFNBQVM7S0FDVCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBWFcsUUFBQSxVQUFVLGNBV3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICB0ZXN0U2NoZW1hIGZyb20gJy4vdGVzdC1zY2hlbWEuanNvbic7XG5cblxuZXhwb3J0IGNvbnN0IGR1bXAgPSAob2JqKSA9PiBjb25zb2xlLmluZm8oSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCAyKSk7XG5cbi8vIHRoaXMgaXMgYW4gZXhwZXJpbWVudGFsIGZ1bmN0aW9uIHRvIGVuYWJsZSBtb2NraW5nIHdpdGhpbiB0aGUgc2FtZSBmaWxlIGFzIHRoZSBpbnZva2VkIGZ1bmN0aW9uXG5leHBvcnQgY29uc3QgcHJlcE1vZHVsZSA9IG5hbWUgPT4ge1xuXHRqZXN0Lm1vY2sobmFtZSk7XG5cdGNvbnN0IG1vY2sgPSBqZXN0LnJlcXVpcmVNb2NrKG5hbWUpO1xuXHRjb25zdCB1bmRlclRlc3QgPSBqZXN0LnJlcXVpcmVBY3R1YWwobmFtZSk7XG5cdGJlZm9yZUVhY2goKCkgPT4ge1xuXHRcdGplc3QucmVzZXRBbGxNb2NrcygpO1xuXHR9KTtcblx0cmV0dXJuIHtcblx0XHRtb2NrLFxuXHRcdHVuZGVyVGVzdCxcblx0fTtcbn07XG5cbmV4cG9ydCB7IHRlc3RTY2hlbWEgfTtcbiAiXX0=