# eslint-plugin-calledwith-calledtimes

## Description

This plugin checks your test matchers (jasmine, jest, vitest) when
`toHaveBeenCalledWith` is used, and let&apos;s you know you should pair it with `toHaveBeenCalledTimes`.

The purpose of this is to ensure that not only our function is called with arguments,
but _it is called the exact amount of times that we expected_.

## Loose Checking

- `toHaveBeenCalledWith` checks that a function was called with specific arguments
- `toHaveBeenCalledTimes` checks that a function was called an expected amount of times

```tsx
expect(consoleSpy).toHaveBeenCalledWith("sending");
expect(consoleSpy).toHaveBeenCalledWith("cancelling");
```

This doesn't check that the function was called the amount of times we expected it to be called.

```diff
expect(consoleSpy).toHaveBeenCalledWith("sending");
expect(consoleSpy).toHaveBeenCalledWith("cancelling");
+ expect(consoleSpy).toHaveBeenCalledTimes(2);
```

Now if `consoleSpy` happens to accidentally get called more than we expected, it will error.

This gives us confidence that our code works exactly as expected.

## Granular Checking

- `toHaveBeenNthCalledWith` checks that a function was called with specific arguments on the nth time the function was called
- `toHaveBeenCalledTimes` checks that a function was called an expected amount of times

```tsx
expect(consoleSpy).toHaveBeenNthCalledWith(1, "sending");
expect(consoleSpy).toHaveBeenNthCalledWith(2, "cancelling");
expect(consoleSpy).toHaveBeenCalledTimes(2);
```

[Inspiration](https://twitter.com/kentcdodds/status/1162098139609698304)

> [!NOTE]  
> Currently, this has only been tested with `jest` but it should work with other test frameworks
> like `jasmine` and `vitest`. Please let me know if it works with these.

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

This only needs to run against

Then configure the rules you want to use under the rules section.

```json
{
	"rules": {
		"calledwith-calledtimes/jest": "warn"
	}
}
```

## Configurations

<!-- begin auto-generated configs list -->

TODO: Run eslint-doc-generator to generate the configs list (or delete this section if no configs are offered).

<!-- end auto-generated configs list -->

## Rules

<!-- begin auto-generated rules list -->

| Name                       | Description                                                                                   |
| :------------------------- | :-------------------------------------------------------------------------------------------- |
| [jest](docs/rules/jest.md) | Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes` |

<!-- end auto-generated rules list -->
