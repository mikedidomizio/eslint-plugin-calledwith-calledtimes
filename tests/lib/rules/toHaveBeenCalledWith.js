const rules = require('../../../lib');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const missingCalledTimesMessage = `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;
const missingCalledWithMessage = `Adding \`.toHaveBeenCalledWith()\` before \`toHaveBeenCalledTimes()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`

ruleTester.run('toHaveBeenCalledWith', rules.rules['toHaveBeenCalledWith'], {
	valid: [
		{
			name: 'toHaveBeenCalledTimes is used after toHaveBeenCalledWith',
			code: `
				expect('foo').toHaveBeenCalledWith('bar')
				expect('foo').toHaveBeenCalledTimes(1)
			`,
		},
	],
	invalid: [
		// {
		// 	name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith (not correct node after)',
		// 	code: `
		// 	expect('foo').toHaveBeenCalledWith('bar')
		// 	expect('foo').toHaveBeenCalled()
		// `,
		// 	errors: [{ message: missingCalledTimesMessage }],
		// },
		// {
		// 	name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith (no node after)',
		// 	code: `
		// 	expect('foo').toHaveBeenCalledWith('bar')
		// `,
		// 	errors: [{ message: missingCalledTimesMessage }],
		// },
		// {
		// 	name: 'toHaveBeenCalledWith to be before toHaveBeenCalledTimes (no node before)',
		// 	code: `
		// 	expect('foo').toHaveBeenCalledTimes(1)
		// `,
		// 	errors: [{ message: missingCalledWithMessage }],
		// },
		// {
		// 	name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith, and not before',
		// 	code: `
		// 		expect('foo').toHaveBeenCalledTimes(1)
		// 		expect('foo').toHaveBeenCalledWith('bar');
		// 	`,
		// 	output: `
		// 		expect('foo').toHaveBeenCalledWith('bar');
		// 		expect('foo').toHaveBeenCalledTimes(1)
		// 	`,
		// 	errors: [{ message: missingCalledTimesMessage }],
		// },
		{
			name: 'custom error message',
			options: [
				{
					reportMessage: 'Please put them in the order we expect',
				},
			],
			code: `
				expect('foo').toHaveBeenCalledTimes(1)
				expect('foo').toHaveBeenCalledWith('bar');
			`,
			output: `
				expect('foo').toHaveBeenCalledWith('bar');
				expect('foo').toHaveBeenCalledTimes(1)
			`,
			errors: [{ message: 'Please put them in the order we expect' }],
		},
	],
});
