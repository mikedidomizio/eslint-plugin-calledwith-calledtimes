## 1.4.2 (2024-09-19)

- Fix report node to be first offender for `strictOrderOfNthCalledWith` option

## 1.4.1 (2024-09-18)

- Fixes an issue where more than one out of order `toHaveBeenNthCalledWith`, and `toHaveBeenCalledTimes` out of order wouldn't get properly fixed.

## 1.4.0 (2024-09-17)

- Adds three new options
  - `toHaveBeenNthCalledWith.strictOrderOfNthCalledWith` which checks that the order of `NthCalledWith` is numerically ordered.
  - `toHaveBeenCalledWith.strictNumberOfCalledWithMatchesCalledTimes` which ensures that when using `calledTimes` that the number of `toHaveBeenCalledWith` is fully listed.
  - `toHaveBeenNthCalledWith.strictNumberOfCalledWithMatchesCalledTimes` which ensures that when using `calledTimes` that the number of `toHaveBeenNthCalledWith` is fully listed.

## 1.3.1 (2024-09-17)

- Fix a few checks to ensure the expected lines are reported

## 1.3.0 (2024-09-16)

- Report if the `expect` function args do not match the other `expect` function args

## 1.2.0 (2024-09-16)

- Autofix lines that are out of order for `toHaveBeenCalledWith`
- Autofix lines that are out of order for `toHaveBeenNthCalledWith`

## 1.1.0 (2024-07-23)

- Add expects `toHaveBeenNthCalledWith` followed by `toHaveBeenCalledTimes`
- Change error message for `toHaveBeenNthCalledWith`
- Add custom error messages

## 1.0.0 (2024-07-23)

- Expects `toHaveBeenCalledWith` followed by `toHaveBeenCalledTimes`
