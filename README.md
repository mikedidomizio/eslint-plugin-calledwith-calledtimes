# eslint-plugin-pair-calledwith-calledtimes

This plugin checks your test matchers (jasmine, jest, vitest) when
`toHaveBeenCalledWith` is used, and let&apos;s you know you should follow it with `toHaveBeenCalledTimes`

The purpose of this is to ensure that not only our function is called with arguments,
but _it is called the exact amount of times that we expected_.

[Inspiration](https://twitter.com/kentcdodds/status/1162098139609698304)

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-pair-calledwith-calledtimes`:

```sh
npm install eslint-plugin-pair-calledwith-calledtimes --save-dev
```

## Usage

Add `pair-calledwith-calledtimes` to the plugins section of your `.eslintrc` configuration file. You
can omit the `eslint-plugin-` prefix:

```json
{
	"plugins": ["pair-calledwith-calledtimes"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
	"rules": {
		"pair-calledwith-calledtimes/jest": "warn"
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
