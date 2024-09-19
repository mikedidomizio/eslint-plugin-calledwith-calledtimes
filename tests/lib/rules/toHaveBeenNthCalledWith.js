const rules = require('../../../lib');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const missingCalledTimesMessage = `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenNthCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;
const missingCalledWithMessage = 'Adding `.toHaveBeenNthCalledWith()` before `toHaveBeenCalledTimes()` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.';

const identifiersAreNotMatching = `Please add the matching argument for expect(ARG).toHaveBeenCalledTimes`;

const missingExpectedToHaveBeenNthCalledWith =
	'`toHaveBeenNthCalledWith` needs to be explicit and match the number of `toHaveBeenCalledTimes`';

const outOfOrderNthCalledWith = 'Please order the `toHaveBeenNthCalledWith` numerically';

ruleTester.run('toHaveBeenNthCalledWith', rules.rules['jest'], {
	valid: [
		{
			name: 'toHaveBeenCalledTimes is used after toHaveBeenNthCalledWith',
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(1)
			`,
		},
		{
			name: 'function calls before don\'t get reported',
			code: `
				foo('bar')
				
				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
				expect(foo).toHaveBeenCalledTimes(1)
			`
		}
	],
	invalid: [
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledWith (not correct node after)',
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalled()
			`,
			errors: [
				{
					message: missingCalledTimesMessage,
					type: 'ExpressionStatement',
					line: 3,
					column: 5,
				},
			],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledWith (no node after)',
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
			`,
			errors: [
				{
					message: missingCalledTimesMessage,
					type: 'ExpressionStatement',
					line: 2,
					column: 5,
				},
			],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledWith, and not before',
			code: `
				foo('bar')
			
				expect(foo).toHaveBeenCalledTimes(1)
				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
			`,
			output: `
				foo('bar')

				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
				expect(foo).toHaveBeenCalledTimes(1)
			`,
			errors: [
				{
					message: missingCalledWithMessage,
					type: 'ExpressionStatement',
					line: 4,
					column: 5,
				},
			],
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
			errors: [
				{
					message: 'Please put them in the order we expect',
					type: 'ExpressionStatement',
					line: 2,
					column: 5,
				},
			],
		},
		{
			name: 'arg of expect must match arg of other expect',
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(hello).toHaveBeenCalledTimes(1)
			`,
			errors: [
				{
					message: identifiersAreNotMatching,
					type: 'ExpressionStatement',
					line: 3,
					column: 5,
				},
			],
		},
	],
});

ruleTester.run('strictNumberOfCalledWithMatchesCalledTimes', rules.rules['jest'], {
	valid: [
		{
			name: 'number of toHaveBeenNthCalledWith calls matches number in toHaveBeenCalledTimes',
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
			name: "number of toHaveBeenNthCalledWith calls doesn't match number in toHaveBeenCalledTimes (calledTimes: number)",
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
				{
					message: missingExpectedToHaveBeenNthCalledWith,
					type: 'ExpressionStatement',
					line: 3,
					column: 5,
				},
			],
		},
		{
			name: "number of toHaveBeenNthCalledWith calls doesn't match string in toHaveBeenCalledTimes (calledTimes: string)",
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
				{
					message: missingExpectedToHaveBeenNthCalledWith,
					type: 'ExpressionStatement',
					line: 3,
					column: 5,
				},
			],
		},
		{
			name: 'number of toHaveBeenNthCalledWith before matches number of toHaveBeenCalledTimes',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: true,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenCalled()
				expect(foo).toHaveBeenNthCalledWith(2, 'bar2')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
			errors: [
				{
					message: '`toHaveBeenNthCalledWith` needs to be explicit and match the number of `toHaveBeenCalledTimes`',
					type: 'ExpressionStatement',
					line: 4,
					column: 5,
				},
			],
		},
	],
});

ruleTester.run('strictOrderOfNthCalledWith', rules.rules['jest'], {
	valid: [
		{
			name: 'order of toHaveBeenNthCalledWith is correct (consecutive increment)',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictOrderOfNthCalledWith: true,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenNthCalledWith(2, 'bar2')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar2')
				expect(foo).toHaveBeenCalledTimes(3)
			`,
		},
		{
			name: 'order of toHaveBeenNthCalledWith is correct (non-sequential list)',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictOrderOfNthCalledWith: true,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar2')
				expect(foo).toHaveBeenNthCalledWith(8, 'bar2')
				expect(foo).toHaveBeenCalledTimes(3)
			`,
		},
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
				expect(foo).toHaveBeenNthCalledWith(9, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(3)
			`,
		},
	],
	invalid: [
		{
			name: 'toHaveBeenNthCalledWith to be ordered',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictOrderOfNthCalledWith: true,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(4, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(4)
			`,
			output: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenNthCalledWith(4, 'bar')
				expect(foo).toHaveBeenCalledTimes(4)
			`,
			errors: [
				{
					message: outOfOrderNthCalledWith,
					type: 'ExpressionStatement',
					line: 4,
					column: 5,
				},
			],
		},
		{
			name: 'number of toHaveBeenNthCalledWith is not ordered and toHaveBeenCalledTimes is before',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictOrderOfNthCalledWith: true,
					},
				},
			],
			code: `
				expect(foo).toHaveBeenCalledTimes(3)
				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
			`,
			output: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenCalledTimes(3)
			`,
			errors: [
				{
					message: missingCalledWithMessage,
					type: 'ExpressionStatement',
					line: 2,
					column: 5,
				},
				{
					message: outOfOrderNthCalledWith,
					type: 'ExpressionStatement',
					line: 5,
					column: 5,
				}
			],
		},
	],
});
