const rules = require('../../../lib');
const RuleTester = require('eslint').RuleTester;

const { messages } = require('../../../lib/rules/constants');

const ruleTester = new RuleTester();

ruleTester.run('toHaveBeenNthCalledWith', rules.rules['jest'], {
	valid: [
		{
			name: 'toHaveBeenCalledTimes is used after toHaveBeenNthCalledWith',
			code: `
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(1)
			`,
		},
	],
	invalid: [
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledWith (not correct node after)',
			code: `
				foo()

				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalled()
			`,
			errors: [
				{
					message: messages.missingToHaveBeenNthCalledTimes,
					type: 'ExpressionStatement',
					line: 5,
					column: 5,
				},
			],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledWith (no node after)',
			code: `
				foo()

				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
			`,
			errors: [
				{
					message: messages.missingToHaveBeenNthCalledTimes,
					type: 'ExpressionStatement',
					line: 4,
					column: 5,
				},
			],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledWith, and not before',
			code: `
				foo()

				expect(foo).toHaveBeenCalledTimes(1)
				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
			`,
			output: `
				foo()

				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
				expect(foo).toHaveBeenCalledTimes(1)
			`,
			errors: [
				{
					message: messages.missingToHaveBeenNthCalledWith,
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
				foo()

				expect(foo).toHaveBeenCalledTimes(1);
				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
			`,
			output: `
				foo()

				expect(foo).toHaveBeenNthCalledWith(1, 'bar');
				expect(foo).toHaveBeenCalledTimes(1);
			`,
			errors: [
				{
					message: 'Please put them in the order we expect',
					type: 'ExpressionStatement',
					line: 4,
					column: 5,
				},
			],
		},
		{
			name: 'arg of expect must match arg of other expect',
			code: `
				foo()

				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(hello).toHaveBeenCalledTimes(1)
			`,
			errors: [
				{
					message: messages.identifiersAreNotMatching,
					type: 'ExpressionStatement',
					line: 5,
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
				foo()

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
				foo()

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
				foo()

				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
			errors: [{
				message: messages.missingExpectedToHaveBeenNthCalledWith,
				type: 'ExpressionStatement',
				line: 5,
				column: 5,
			}],
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
				foo()

				expect(foo).toHaveBeenCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes('2')
			`,
			errors: [{
				message: messages.missingExpectedToHaveBeenNthCalledWith,
				type: 'ExpressionStatement',
				line: 5,
				column: 5,
			}],
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
				foo()

				expect(foo).toHaveBeenCalled()
				expect(foo).toHaveBeenNthCalledWith(2, 'bar2')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar2')
				expect(foo).toHaveBeenCalledTimes(3)
			`,
			errors: [{
				message: messages.missingExpectedToHaveBeenNthCalledWith,
				type: 'ExpressionStatement',
				line: 7,
				column: 5,
			}],
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
				foo()

				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenNthCalledWith(2, 'bar2')
				expect(foo).toHaveBeenCalledTimes(2)
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
				foo()

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
				foo()

				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
		},
	],
	invalid: [
		{
			name: 'toHaveBeenNthCalledWith is not ordered when rule is set to true',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictOrderOfNthCalledWith: true,
					},
				},
			],
			code: `
				foo()

				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenCalledTimes(3)
			`,
			output: `
				foo()

				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenCalledTimes(3)
			`,
			errors: [{
				message: messages.outOfOrderNthCalledWith,
				type: 'ExpressionStatement',
				line: 6,
				column: 5,
			}],
		},
		{
			name: 'toHaveBeenNthCalledWith is not ordered, and toHaveBeenCalledTimes is before',
			options: [
				{
					toHaveBeenNthCalledWith: {
						strictOrderOfNthCalledWith: true,
					},
				},
			],
			code: `
				foo()

				expect(foo).toHaveBeenCalledTimes(3)
				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
			`,
			output: `
				foo()

				expect(foo).toHaveBeenNthCalledWith(1, 'bar')
				expect(foo).toHaveBeenNthCalledWith(2, 'bar')
				expect(foo).toHaveBeenNthCalledWith(3, 'bar')
				expect(foo).toHaveBeenCalledTimes(3)
			`,
			errors: [
				{
					message: messages.missingToHaveBeenNthCalledWith,
					type: 'ExpressionStatement',
					line: 4,
					column: 5,
				},
				{
					message: messages.outOfOrderNthCalledWith,
					type: 'ExpressionStatement',
					line: 7,
					column: 5,
				}
			],
		},
	],
});
