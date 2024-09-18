# eslint-plugin-calledwith-calledtimes

[![Tests Workflow](https://github.com/mikedidomizio/eslint-plugin-calledwith-calledtimes/actions/workflows/tests.yaml/badge.svg)](https://github.com/mikedidomizio/eslint-plugin-calledwith-calledtimes/actions/workflows/tests.yaml?query=branch%3Amain)
[![NPM Downloads](https://img.shields.io/npm/dm/eslint-plugin-calledwith-calledtimes)](https://www.npmjs.com/package/eslint-plugin-calledwith-calledtimes)

## Description

This plugin checks your test matchers (jasmine, jest, vitest) when
`toHaveBeenCalledWith` and `toHaveBeenNthCalledWith` is used, and suggests you should pair it with `toHaveBeenCalledTimes`.

The purpose of this is to ensure that not only our function is called with the expected arguments,
but _it is called the exact amount of times that we expected_.

This can avoid bugs where a function is called more or less than what we expect, or a function is called
with arguments that we didn't intend.

## Explanation

### `toHaveBeenCalledWith` (Loose Checking)

- `toHaveBeenCalledWith` checks that a function was called with specific arguments.
- `toHaveBeenCalledTimes` checks that a function was called an expected amount of times.

```tsx
expect(submitSpy).toHaveBeenCalledWith('sending');
expect(submitSpy).toHaveBeenCalledWith('cancelling');
```

This doesn't check that the function was called the amount of times we expected it to be called.

```diff
expect(submitSpy).toHaveBeenCalledWith('sending');
expect(submitSpy).toHaveBeenCalledWith('cancelling');
+ expect(submitSpy).toHaveBeenCalledTimes(2);
```

Now if `submitSpy` happens to accidentally get called more than we expected, it will be reported by ESLint.

This gives us confidence that our functions aren't being called any more than what we expect.

### `toHaveBeenNthCalledWith` (Granular Checking)

- `toHaveBeenNthCalledWith` checks that a function was called with specific arguments on the nth time the function was called.
- `toHaveBeenCalledTimes` checks that a function was called an expected amount of times.

```diff
expect(submitSpy).toHaveBeenNthCalledWith(1, 'sending');
expect(submitSpy).toHaveBeenNthCalledWith(2, 'cancelling');
+ expect(submitSpy).toHaveBeenCalledTimes(2);
```

This allows us to know the order of the function calls, in addition confirm that the function is called the exact amount of times we expect.

### Additionally

This plugin will also notify you if you are using `toHaveBeenCalledTimes` without `toHaveBeenCalledWith` or `toHaveBeenNthCalledWith`. It works both ways to get you to use the matchers together.

## Inspiration

The inspiration behind this I believe was due to myself having hit bugs in a code base at some point in time, and realized the benefit of pairing these matchers together. The simple addition of one other line can prevent a lot of headaches whether it's existing bugs or during refactoring. It can turn a good test into a great test.

In my attempt to see if anyone had the same idea, I came across this [tweet](https://x.com/kentcdodds/status/1162098139609698304), which also had some good points on how to structure these together.

Over the years I followed this pattern closely. In an attempt to get others to understand and follow, I decided to go back and see if the pattern still held [true](https://x.com/Mike_DiDomizio/status/1813911558935708125) for Kent, which it did.

To ensure going forward this pattern was followed, this plugin was created.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-calledwith-calledtimes`:

```sh
npm install eslint-plugin-calledwith-calledtimes --save-dev
```

## Usage

Add `calledwith-calledtimes` to the plugins section of your `.eslintrc` configuration file. You
can omit the `eslint-plugin-` prefix:

```json
{
	"plugins": ["calledwith-calledtimes"]
}
```

Then configure the rules you want to use under the rules section.

> [!NOTE]  
> Currently, this has only been tested with `jest` but it should work with other test frameworks
> like `jasmine` and `vitest`. Please let me know if it works with these.

```json
{
	"rules": {
		"calledwith-calledtimes/jest": "warn"
	}
}
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                       | Description                                                                                   | 🔧 |
| :------------------------- | :-------------------------------------------------------------------------------------------- | :- |
| [jest](docs/rules/jest.md) | Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes` | 🔧 |

<!-- end auto-generated rules list -->
