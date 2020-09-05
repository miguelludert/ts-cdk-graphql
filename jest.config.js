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
	},
};
