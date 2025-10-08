import rules from '../../../lib';

// @ts-ignore
import { messages } from '../../../lib/rules/constants';

// @ts-ignore
import { runRuleTester } from '../utils';

// @ts-ignore
import { shouldRunTest } from '../helpers';

runRuleTester('toHaveBeenCalledWith', rules.rules['jest'], {
	valid: [
		{
			name: 'toHaveBeenCalledTimes is used after toHaveBeenCalledWith',
			code: `
				foo()

				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledTimes(1)
			`,
		},
	].filter(shouldRunTest),
	invalid: [
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith (not correct node after)',
			code: `
				foo()

				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalled()
			`,
			errors: [
				{
					message: messages.toHaveBeenCalledTimesNotAfter,
					type: 'ExpressionStatement',
					line: 5,
					column: 5,
				},
			],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith (no node after)',
			code: `
				foo()

				expect(foo).toHaveBeenCalledWith('bar')
			`,
			errors: [
				{
					message: messages.toHaveBeenCalledTimesNotAfter,
					type: 'ExpressionStatement',
					line: 4,
					column: 5,
				},
			],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith, and not before',
			code: `
				foo()

				expect(foo).toHaveBeenCalledTimes(1)
				expect(foo).toHaveBeenCalledWith('bar');
			`,
			output: `
				foo()

				expect(foo).toHaveBeenCalledWith('bar');
				expect(foo).toHaveBeenCalledTimes(1)
			`,
			errors: [
				{
					message: messages.toHaveBeenCalledWithNotBefore,
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
				expect(foo).toHaveBeenCalledWith('bar');
			`,
			output: `
				foo()

				expect(foo).toHaveBeenCalledWith('bar');
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

				expect(foo).toHaveBeenCalledWith('bar')
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
	].filter(shouldRunTest),
});

runRuleTester('strictNumberOfCalledWithMatchesCalledTimes', rules.rules['jest'], {
	valid: [
		{
			name: 'number of toHaveBeenCalledWith calls matches number in toHaveBeenCalledTimes',
			options: [
				{
					toHaveBeenCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: true,
					},
				},
			],
			code: `
				foo()

				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledWith('bar2')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
		},
		{
			name: 'if option false, will not report',
			options: [
				{
					toHaveBeenCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: false,
					},
				},
			],
			code: `
				foo()

				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
		},
	].filter(shouldRunTest),
	invalid: [
		{
			name: "number of toHaveBeenCalledWith calls doesn't match number in toHaveBeenCalledTimes (calledTimes: number)",
			options: [
				{
					toHaveBeenCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: true,
					},
				},
			],
			code: `
				foo()

				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledTimes(2)
			`,
			errors: [
				{
					message: messages.missingExpectedToHaveBeenCalledWith
				},
			],
		},
		{
			name: "number of toHaveBeenCalledWith calls doesn't match string in toHaveBeenCalledTimes (calledTimes: string)",
			options: [
				{
					toHaveBeenCalledWith: {
						strictNumberOfCalledWithMatchesCalledTimes: true,
					},
				},
			],
			code: `
				foo()

				expect(foo).toHaveBeenCalledWith('bar')
				expect(foo).toHaveBeenCalledTimes('2')
			`,
			errors: [
				{
					message: messages.missingExpectedToHaveBeenCalledWith
				},
			],
		},
	].filter(shouldRunTest),
});
