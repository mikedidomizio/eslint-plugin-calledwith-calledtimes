# eslint-plugin-calledwith-calledtimes

## Description

This plugin checks your test matchers (jasmine, jest, vitest) when
`toHaveBeenCalledWith` is used, and reports if it is not paired with `toHaveBeenCalledTimes`.

The idea of this is to ensure that not only that our function is called with arguments,
but _it is called the exact amount of times that we expected_.

## Loose Checking

- `toHaveBeenCalledWith` checks that a function was called with specific arguments
- `toHaveBeenCalledTimes` checks that a function was called an expected amount of times

```tsx
expect(fnSpy).toHaveBeenCalledWith("sending");
expect(fnSpy).toHaveBeenCalledWith("cancelling");
```

This doesn't check that the function was called the amount of times we expected it to be called.

```diff
expect(fnSpy).toHaveBeenCalledWith("sending");
expect(fnSpy).toHaveBeenCalledWith("cancelling");
+ expect(fnSpy).toHaveBeenCalledTimes(2);
```

Now if `fnSpy` happens to accidentally get called more or less than we expected, it will result in a test failure.

This gives us confidence that our code works exactly as expected.

## Granular Checking

- `toHaveBeenNthCalledWith` checks that a function was called with specific arguments on the nth time the function was called
- `toHaveBeenCalledTimes` checks that a function was called an expected amount of times

```tsx
expect(fnSpy).toHaveBeenNthCalledWith(1, "sending");
expect(fnSpy).toHaveBeenNthCalledWith(2, "cancelling");
expect(fnSpy).toHaveBeenCalledTimes(2);
```

## Inspiration

I'm not entirely sure if it was because it just made sense to check, or if it was a result of issues in my code,
but at some point I started pairing these matchers with `toHaveBeenCalledTimes`.

I thought that it was strange there wasn't a matcher already for this (since then I've come to terms it may be too specific of a matcher, there's many of those), 
and in my search out there for answers, I found that [Kent C. Dodds](https://twitter.com/kentcdodds/status/1162098139609698304) also had similar thoughts that they should be paired.

## Installation

```sh
npm install eslint eslint-plugin-calledwith-calledtimes --save-dev
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

```json
{
	"rules": {
		// although the rule is called jest, it should work with vitest/jasmine
		"calledwith-calledtimes/jest": "warn"
	}
}
```

> [!NOTE]  
> This only needs to run against test files, this can be done with [files](https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores)

## Rules

<!-- begin auto-generated rules list -->

| Name                       | Description                                                                                   |
| :------------------------- | :-------------------------------------------------------------------------------------------- |
| [jest](docs/rules/jest.md) | Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes` |

<!-- end auto-generated rules list -->
