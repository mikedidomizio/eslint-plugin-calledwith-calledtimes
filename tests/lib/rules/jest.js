const rules = require("../../../lib");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();

const message = `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`

ruleTester.run('jest', rules.rules['jest'], {
	valid: [{
		code: `
				expect('foo').toHaveBeenCalledWith('bar')
				expect('foo').toHaveBeenCalledTimes(1)
			`,
	}],
	invalid: [
	// expecting toHaveBeenCalledTimes to be after toHaveBeenCalledWith (not expected node after)
	{
		code: `
			expect('foo').toHaveBeenCalledWith('bar')
			expect('foo').toHaveBeenCalled()
		`,
		errors: [{message}],
	},
	// expecting toHaveBeenCalledTimes to be after toHaveBeenCalledWith (no node after)
	{
		code: `
			expect('foo').toHaveBeenCalledWith('bar')
		`,
		errors: [{message}],
	}]
})
