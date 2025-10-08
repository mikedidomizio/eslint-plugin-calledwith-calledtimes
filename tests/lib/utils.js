import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

// Override the default `it` and `describe` functions to use `vitest`
RuleTester.it = it
RuleTester.describe = describe
RuleTester.itOnly = it.only

export function runRuleTester(...args) {
	return new RuleTester({
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
	}).run(...args)
}
