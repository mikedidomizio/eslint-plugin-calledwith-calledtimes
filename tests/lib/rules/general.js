const rules = require('../../../lib');
const RuleTester = require('eslint').RuleTester;

const { messages } = require('../../../lib/rules/constants');

const ruleTester = new RuleTester();

ruleTester.run('general', rules.rules['jest'], {
	valid: [],
	invalid: [
		{
			name: 'Missing toHaveBeenCalledWith/toHaveBeenNthCalledWith (no node before)',
			code: `
				expect('foo').toHaveBeenCalledTimes(1)
			`,
			errors: [
				{
					message: messages.missingToHaveBeenCalledWith,
					type: 'ExpressionStatement',
					line: 2,
					column: 5,
				},
			],
		},
	],
});
