const rules = require('../../../lib');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const missingCalledWithMessage = `Adding \`.toHaveBeenCalledWith()\` before \`toHaveBeenCalledTimes()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;

ruleTester.run('jest', rules.rules['jest'], {
	valid: [],
	invalid: [
		{
			name: 'Missing toHaveBeenCalledWith/toHaveBeenNthCalledWith (no node before)',
			code: `
				expect('foo').toHaveBeenCalledTimes(1)
			`,
			errors: [
				{
					message: missingCalledWithMessage,
					type: 'ExpressionStatement',
					line: 2,
					column: 5,
				},
			],
		},
	],
});
