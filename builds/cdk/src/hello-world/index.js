module.exports = {
	handler: event => {
		console.info("hello world");
		console.info(JSON.stringify(event, null, 2));
		return "hello world";
	},
};
