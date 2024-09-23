const INDIVIDUAL_TEST = process.env.INDIVIDUAL_TEST

// if INDIVIDUAL_TEST is set with the test name it will only run that specific test
function shouldRunTest(test) {
	return test.name === INDIVIDUAL_TEST || INDIVIDUAL_TEST === undefined
}

module.exports = {
	shouldRunTest
}
