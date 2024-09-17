const rules = require('../../../lib');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const missingCalledTimesMessage = `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenNthCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;
const missingCalledWithMessage = `Adding \`.toHaveBeenNthCalledWith()\` before \`toHaveBeenCalledTimes()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;

const identifiersAreNotMatching = `Please add the matching argument for expect(ARG).toHaveBeenCalledTimes`;

ruleTester.run('toHaveBeenNthCalledTimes', rules.rules['jest'], {
	valid: [
		{
			name: 'toHaveBeenCalledTimes is used after toHaveBeenNthCalledTimes',
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(1)
			`,
		},
	],
	invalid: [
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledTimes (not correct node after)',
			code: `
			expect(foo).toHaveBeenNthCalledWith(1, 'bar')
			expect(foo).toHaveBeenCalled()
		`,
			errors: [{ message: missingCalledTimesMessage }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledTimes (no node after)',
			code: `
			expect(foo).toHaveBeenNthCalledWith(1, 'bar')
		`,
			errors: [{ message: missingCalledTimesMessage }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledTimes, and not before',
			code: `
				expect(foo).toHaveBeenCalledTimes(1)
				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
			`,
			output: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
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
				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
			`,
			output: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
				expect(foo).toHaveBeenCalledTimes(1);
			`,
			errors: [{ message: 'Please put them in the order we expect' }],
		},
		{
			name: 'expect arg of expect, must match arg of other expect',
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(hello).toHaveBeenCalledTimes(1)
			`,
			errors: [{ message: identifiersAreNotMatching }],
		},
	],
});

ruleTester.run('strictNumberOfCalledWithMatchesCalledTimes', rules.rules['jest'], {
	valid: [
		{
			name: 'expected number of toHaveBeenNthCalledWith matches toHaveBeenCalledTimes',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: true,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenNthCalledWith(2, 'bar2')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
		},
		{
			name: 'if option false, will not report',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: false,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
		},
	],
	invalid: [
		{
			name: "expected number of toHaveBeenNthCalledWith doesn't match toHaveBeenCalledTimes (calledTimes: number)",
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: true,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
			errors: [
				{ message: '`toHaveBeenNthCalledWith` needs to be explicit and match the number of `toHaveBeenCalledTimes`' },
			],
		},
		{
			name: "expected number of toHaveBeenNthCalledWith doesn't match toHaveBeenCalledTimes (calledTimes: string)",
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: true,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes('2')
			`,
			errors: [
				{ message: '`toHaveBeenNthCalledWith` needs to be explicit and match the number of `toHaveBeenCalledTimes`' },
			],
		},
	],
});

ruleTester.run('strictOrderOfNthCalledWith', rules.rules['jest'], {
	valid: [
		{
			name: 'expected order of toHaveBeenNthCalledWith',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictOrderOfNthCalledWith: true,
					},
				},
			],
			// todo what happens if expect(ARG) is different here, does another test fail? I think it does?
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenNthCalledWith(2, 'bar2')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
		},
		// todo if the number does not match (ex. 2=>3) it should fail, but does it?
		{
			name: 'if option false, will not report',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictOrderOfNthCalledWith: false,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
		},
	],
	invalid: [{
		name: "expected number of toHaveBeenNthCalledWith is not ordered",
		options: [
			{
				toHaveBeenNthCalledWith: {
					strictOrderOfNthCalledWith: true,
				},
			},
		],
		code: `
				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
		errors: [
			{ message: 'Please order the `toHaveBeenNthCalledWith` numerically' },
		],
	}]
})
