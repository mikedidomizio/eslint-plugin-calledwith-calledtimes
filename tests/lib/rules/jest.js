const rules = require('../../../lib');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

const message = `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`;

ruleTester.run('jest', rules.rules['jest'], {
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
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith (not correct node after)',
			code: `
			expect('foo').toHaveBeenCalledWith('bar')
			expect('foo').toHaveBeenCalled()
		`,
			errors: [{ message }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith (no node after)',
			code: `
			expect('foo').toHaveBeenCalledWith('bar')
		`,
			errors: [{ message }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenCalledWith, and not before',
			code: `
				expect('foo').toHaveBeenCalledTimes(1)
				expect('foo').toHaveBeenCalledWith('bar')
			`,
			errors: [{ message }],
		},
	],
});

ruleTester.run('jest', rules.rules['jest'], {
	valid: [
		{
			name: 'toHaveBeenCalledTimes is used after toHaveBeenNthCalledTimes',
			code: `
				expect('foo').toHaveBeenNthCalledWith('bar')
				expect('foo').toHaveBeenCalledTimes(1)
			`,
		},
	],
	invalid: [
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledTimes (not correct node after)',
			code: `
			expect('foo').toHaveBeenNthCalledWith('bar')
			expect('foo').toHaveBeenCalled()
		`,
			errors: [{ message }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledTimes (no node after)',
			code: `
			expect('foo').toHaveBeenNthCalledWith('bar')
		`,
			errors: [{ message }],
		},
		{
			name: 'toHaveBeenCalledTimes to be after toHaveBeenNthCalledTimes, and not before',
			code: `
				expect('foo').toHaveBeenCalledTimes(1)
				expect('foo').toHaveBeenNthCalledWith('bar')
			`,
			errors: [{ message }],
		},
	],
});
