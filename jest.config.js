// TODO: we need to revisit and configure jest config file properly with all standards
module.exports = {
	roots: ["<rootDir>/src"],
	testEnvironment: "node",
	testMatch: ["**/*.test.js"],
	transform: {
		"^.+\\.js$": "babel-jest",
	},
};
