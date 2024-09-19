const toHaveBeenCalledTimes = 'toHaveBeenCalledTimes';
const toHaveBeenCalledWith = 'toHaveBeenCalledWith';
const toHaveBeenNthCalledWith = 'toHaveBeenNthCalledWith';

const messages = {
    missingToHaveBeenCalledTimes: 'Adding `.toHaveBeenCalledTimes()` after `toHaveBeenCalledWith()` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.',
    missingToHaveBeenCalledWith: 'Adding `.toHaveBeenCalledWith()` before `toHaveBeenCalledTimes()` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.',
    missingExpectedToHaveBeenCalledWith:
        'Missing `toHaveBeenCalledWith` for amount of times called, consider using `toHaveBeenNthCalledWith`',

    missingToHaveBeenNthCalledTimes: 'Adding `.toHaveBeenCalledTimes()` after `toHaveBeenNthCalledWith()` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.',
    missingToHaveBeenNthCalledWith: 'Adding `.toHaveBeenNthCalledWith()` before `toHaveBeenCalledTimes()` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.',
    missingExpectedToHaveBeenNthCalledWith:
        '`toHaveBeenNthCalledWith` needs to be explicit and match the number of `toHaveBeenCalledTimes`',
    outOfOrderNthCalledWith: 'Please order the `toHaveBeenNthCalledWith` numerically',

    identifiersAreNotMatching: `Please add the matching argument for expect(ARG).toHaveBeenCalledTimes`,
}

module.exports = {
    messages,

    toHaveBeenCalledTimes,
    toHaveBeenCalledWith,
    toHaveBeenNthCalledWith,
}
