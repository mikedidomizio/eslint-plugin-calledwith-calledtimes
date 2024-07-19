# eslint-plugin-pair-tohavebeencalledwith-tohavebeencalledtimes

It's good practice to use toHaveBeenCalledWith with toHaveBeenCalledTimes to ensure your function is called the expected
amount of times.

[Inspiration](https://twitter.com/kentcdodds/status/1162098139609698304)

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-pair-tohavebeencalledwith-tohavebeencalledtimes`:

```sh
npm install eslint-plugin-pair-tohavebeencalledwith-tohavebeencalledtimes --save-dev
```

## Usage

Add `pair-tohavebeencalledwith-tohavebeencalledtimes` to the plugins section of your `.eslintrc` configuration file. You
can omit the `eslint-plugin-` prefix:

```json
{
	"plugins": ["pair-tohavebeencalledwith-tohavebeencalledtimes"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
	"rules": {
		"pair-tohavebeencalledwith-tohavebeencalledtimes/rule-name": 2
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
