
// Pass in test names as an env var with delimiter `__`
const FILTER_TESTS = process.env.FILTER_TESTS

let filteredTestsSplit = []

if (FILTER_TESTS) {
	filteredTestsSplit = FILTER_TESTS.split('__')
}

function shouldRunTest(test) {
	return filteredTestsSplit.includes(test.name) || filteredTestsSplit.length === 0
}

module.exports = {
	shouldRunTest
}
