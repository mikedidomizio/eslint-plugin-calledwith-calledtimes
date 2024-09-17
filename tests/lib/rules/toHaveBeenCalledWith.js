const rules = require('../../../lib');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const missingCalledTimesMessage = `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;
const missingCalledWithMessage = `Adding \`.toHaveBeenCalledWith()\` before \`toHaveBeenCalledTimes()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;

const identifiersAreNotMatching = `Please add the matching argument for expect(ARG).toHaveBeenCalledTimes`;

ruleTester.run('toHaveBeenCalledWith', rules.rules['jest'], {
	valid: [
		{
			name: 'toHaveBeenCalledTimes is used after toHaveBeenCalledWith',
			code: `
				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledTimes(1)
			`,
		},
	],
	invalid: [
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith (not correct node after)',
			code: `
			expect(foo).toHaveBeenCalledWith('bar')
			expect(foo).toHaveBeenCalled()
		`,
			errors: [{ message: missingCalledTimesMessage }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith (no node after)',
			code: `
			expect(foo).toHaveBeenCalledWith('bar')
		`,
			errors: [{ message: missingCalledTimesMessage }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith, and not before',
			code: `
				expect(foo).toHaveBeenCalledTimes(1)
				expect(foo).toHaveBeenCalledWith('bar');
			`,
			output: `
				expect(foo).toHaveBeenCalledWith('bar');
				expect(foo).toHaveBeenCalledTimes(1)
			`,
			errors: [{ message: missingCalledWithMessage }],
		},
		{
			name: 'custom error message',
			options: [
				{
					reportMessage: 'Please put them in the order we expect',
				},
			],
			code: `
				expect(foo).toHaveBeenCalledTimes(1);
				expect(foo).toHaveBeenCalledWith('bar');
			`,
			output: `
				expect(foo).toHaveBeenCalledWith('bar');
				expect(foo).toHaveBeenCalledTimes(1);
			`,
			errors: [{ message: 'Please put them in the order we expect' }],
		},
		{
			name: 'expect arg of expect, must match arg of other expect',
			code: `
				expect(foo).toHaveBeenCalledWith('bar')
				expect(hello).toHaveBeenCalledTimes(1)
			`,
			errors: [{ message: identifiersAreNotMatching }],
		},
	],
});

ruleTester.run('strictNumberOfCalledWithMatchesCalledTimes', rules.rules['jest'], {
	valid: [		{
		name: 'expected number of toHaveBeenCalledWith matches toHaveBeenCalledTimes',
		options: [
			{
				toHaveBeenCalledWith: {
					strictNumberOfCalledWithMatchesCalledTimes: true,
				}
			},
		],
		code: `
				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledWith('bar2')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
	}, {
		name: 'if option false, will not report',
		options: [
			{
				toHaveBeenCalledWith: {
					strictNumberOfCalledWithMatchesCalledTimes: false,
				}
			},
		],
		code: `
				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
	}],
	invalid: [{
		name: 'expected number of toHaveBeenCalledWith doesn\'t match toHaveBeenCalledTimes (calledTimes: number)',
		options: [
			{
				toHaveBeenCalledWith: {
					strictNumberOfCalledWithMatchesCalledTimes: true,
				}
			},
		],
		code: `
				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
		errors: [{ message: 'Missing `toHaveBeenCalledWith` for amount of times called, consider using `toHaveBeenNthCalledWith`' }]
	},
		{
			name: 'expected number of toHaveBeenCalledWith doesn\'t match toHaveBeenCalledTimes (calledTimes: string)',
			options: [
				{
					toHaveBeenCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: true,
					}
				},
			],
			code: `
				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledTimes('2')
			`,
			errors: [{ message: 'Missing `toHaveBeenCalledWith` for amount of times called, consider using `toHaveBeenNthCalledWith`' }]
		}]
})
