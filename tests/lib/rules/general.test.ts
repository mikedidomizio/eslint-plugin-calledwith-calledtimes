import rules from '../../../lib';

// @ts-ignore
import { messages } from '../../../lib/rules/constants';

// @ts-ignore
import { runRuleTester } from '../utils';

// @ts-ignore
import { shouldRunTest } from '../helpers';

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
