const path = require("path");
const nodeExternals = require("webpack-node-externals");
const ENTRY_FILE = path.resolve(__dirname, "index.js");
const OUT_FILE = path.resolve(__dirname, ".output.js");
console.info(ENTRY_FILE);
console.info(OUT_FILE);
module.exports = {
	entry: ENTRY_FILE,
	output: {
		path: __dirname,
		filename: ".output.js",
		library: "[name]",
		libraryTarget: "umd",
	},
	externals: [nodeExternals()],
	target: "node",
	mode: "development",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							[
								"@babel/preset-env",
								{
									targets: { node: "12.11" }, // Node version on AWS Lambda
									modules: false, // See https://babeljs.io/docs/plugins/preset-env/#optionsmodules
								},
							],
						],
					},
				},
			},
			// {
			// 	test: /\.tsx?/,
			// 	use: "ts-loader",
			// 	exclude: /node_modules/,
			// },
		],
	},
	// resolve: {
	// 	extensions: ['.ts', '.js', '.json']
	// }
};
