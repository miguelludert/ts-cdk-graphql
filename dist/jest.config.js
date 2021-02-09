"use strict";
// TODO: we need to revisit and configure jest config file properly with all standards
module.exports = {
    roots: ["<rootDir>/src"],
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts", "**/*.test.js"],
    transform: {
        "^.+\\.ts$": "ts-jest",
        "^.+\\.js$": "babel-jest",
    },
    globals: {
        "ts-jest": {
            diagnostics: false,
        },
        dump: (...vals) => {
            const messages = vals.map((val) => "* " + JSON.stringify(val));
            console.info(messages.join("\n"));
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamVzdC5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9qZXN0LmNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0ZBQXNGO0FBQ3RGLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDaEIsS0FBSyxFQUFFLENBQUMsZUFBZSxDQUFDO0lBQ3hCLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLGVBQWUsRUFBRSxNQUFNO0lBQ3ZCLFNBQVMsRUFBRSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUM7SUFDM0MsU0FBUyxFQUFFO1FBQ1YsV0FBVyxFQUFFLFNBQVM7UUFDdEIsV0FBVyxFQUFFLFlBQVk7S0FDekI7SUFDRCxPQUFPLEVBQUU7UUFDUixTQUFTLEVBQUU7WUFDVixXQUFXLEVBQUUsS0FBSztTQUNsQjtRQUNELElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUU7WUFDakIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvRCxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDO0tBQ0Q7Q0FDRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETzogd2UgbmVlZCB0byByZXZpc2l0IGFuZCBjb25maWd1cmUgamVzdCBjb25maWcgZmlsZSBwcm9wZXJseSB3aXRoIGFsbCBzdGFuZGFyZHNcbm1vZHVsZS5leHBvcnRzID0ge1xuXHRyb290czogW1wiPHJvb3REaXI+L3NyY1wiXSxcblx0cHJlc2V0OiBcInRzLWplc3RcIixcblx0dGVzdEVudmlyb25tZW50OiBcIm5vZGVcIixcblx0dGVzdE1hdGNoOiBbXCIqKi8qLnRlc3QudHNcIiwgXCIqKi8qLnRlc3QuanNcIl0sXG5cdHRyYW5zZm9ybToge1xuXHRcdFwiXi4rXFxcXC50cyRcIjogXCJ0cy1qZXN0XCIsXG5cdFx0XCJeLitcXFxcLmpzJFwiOiBcImJhYmVsLWplc3RcIixcblx0fSxcblx0Z2xvYmFsczoge1xuXHRcdFwidHMtamVzdFwiOiB7XG5cdFx0XHRkaWFnbm9zdGljczogZmFsc2UsXG5cdFx0fSxcblx0XHRkdW1wOiAoLi4udmFscykgPT4ge1xuXHRcdFx0Y29uc3QgbWVzc2FnZXMgPSB2YWxzLm1hcCgodmFsKSA9PiBcIiogXCIgKyBKU09OLnN0cmluZ2lmeSh2YWwpKTtcblx0XHRcdGNvbnNvbGUuaW5mbyhtZXNzYWdlcy5qb2luKFwiXFxuXCIpKTtcblx0XHR9LFxuXHR9LFxufTtcbiJdfQ==