const rules = require("../../../lib");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();

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
		errors: [{message: "Pairing toHaveBeenCalledWith with toHaveBeenCalledTimes ensures that a function is called with a specific set of arguments, a specific amount of times. This ensures that a function is called no more or no less than what is expected."}],
	},
	// expecting toHaveBeenCalledTimes to be after toHaveBeenCalledWith (no node after)
	{
		code: `
			expect('foo').toHaveBeenCalledWith('bar')
		`,
		errors: [{message: "Pairing toHaveBeenCalledWith with toHaveBeenCalledTimes ensures that a function is called with a specific set of arguments, a specific amount of times. This ensures that a function is called no more or no less than what is expected."}],
	}]
})
