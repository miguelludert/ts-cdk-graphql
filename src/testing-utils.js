// this is an experimental function to enable mocking within the same file as the invoked function
export const prepModule = name => {
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
