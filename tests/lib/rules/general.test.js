const rules = require('../../../lib');
const { runRuleTester } = require('../utils')

const { messages } = require('../../../lib/rules/constants');

const { shouldRunTest } = require('../helpers')

runRuleTester('general', rules.rules['jest'], {
	valid: [],
	invalid: [
		{
			name: 'Missing toHaveBeenCalledWith/toHaveBeenNthCalledWith (no node before)',
			code: `
				expect('foo').toHaveBeenCalledTimes(1)
			`,
			errors: [
				{
					message: messages.toHaveBeenCalledWithNotBefore,
					type: 'ExpressionStatement',
					line: 2,
					column: 5,
				},
			],
		},
	].filter(shouldRunTest),
});
