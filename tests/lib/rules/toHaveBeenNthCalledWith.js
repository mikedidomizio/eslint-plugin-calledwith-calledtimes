const rules = require('../../../lib');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const missingCalledTimesMessage = `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenNthCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;
const missingCalledWithMessage = `Adding \`.toHaveBeenNthCalledWith()\` before \`toHaveBeenCalledTimes()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;

ruleTester.run('toHaveBeenNthCalledWith', rules.rules['toHaveBeenNthCalledWith'], {
	valid: [
		{
			name: 'toHaveBeenCalledTimes is used after toHaveBeenNthCalledTimes',
			code: `
				expect('foo').toHaveBeenNthCalledWith(1, 'bar')
				expect('foo').toHaveBeenCalledTimes(1)
			`,
		},
	],
	invalid: [
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledTimes (not correct node after)',
			code: `
			expect('foo').toHaveBeenNthCalledWith(1, 'bar')
			expect('foo').toHaveBeenCalled()
		`,
			errors: [{ message: missingCalledTimesMessage }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledTimes (no node after)',
			code: `
			expect('foo').toHaveBeenNthCalledWith(1, 'bar')
		`,
			errors: [{ message: missingCalledTimesMessage }],
		},
		{
			name: 'toHaveBeenNthCalledWith to be before toHaveBeenCalledTimes (no node before)',
			code: `
			expect('foo').toHaveBeenCalledTimes(1)
		`,
			errors: [{ message: missingCalledWithMessage }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledTimes, and not before',
			code: `
				expect('foo').toHaveBeenCalledTimes(1)
				expect('foo').toHaveBeenNthCalledWith(1, 'bar')
			`,
			errors: [{ message: missingCalledTimesMessage }],
		},
		{
			name: 'custom error message',
			options: [
				{
					reportMessage: 'Please put them in the order we expect',
				},
			],
			code: `
				expect('foo').toHaveBeenCalledTimes(1)
				expect('foo').toHaveBeenNthCalledWith(1, 'bar')
			`,
			errors: [{ message: 'Please put them in the order we expect' }],
		},
	],
});
