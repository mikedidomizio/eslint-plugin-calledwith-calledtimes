const toHaveBeenCalledTimes = 'toHaveBeenCalledTimes';
const toHaveBeenCalledWith = 'toHaveBeenCalledWith';
const toHaveBeenNthCalledWith = 'toHaveBeenNthCalledWith';

const repeatedPartsOfMessages = {
    orderExpectation: "This ensures first that a function is called with a set of arguments, then after that it is called no more or no less than what is expected."
}

const messages = {
    // toHaveBeenCalledWith
    toHaveBeenCalledTimesNotAfter: `Missing \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\`. ${repeatedPartsOfMessages.orderExpectation}`,
    toHaveBeenCalledWithNotBefore: `Missing \`.toHaveBeenCalledWith()\` before \`toHaveBeenCalledTimes()\`. ${repeatedPartsOfMessages.orderExpectation}`,

    // toHaveBeenNthCalledWith
    toHaveBeenCalledTimesNotAfterNth: `Missing \`.toHaveBeenCalledTimes()\` after \`toHaveBeenNthCalledWith()\`. ${repeatedPartsOfMessages.orderExpectation}`,
    toHaveBeenNthCalledWithNotBefore: `Missing \`.toHaveBeenNthCalledWith()\` before \`toHaveBeenCalledTimes()\` ${repeatedPartsOfMessages.orderExpectation}`,

    // general
    identifiersAreNotMatching: `Please add the matching argument for expect(ARG).toHaveBeenCalledTimes`,

    // the following errors are for options
    missingExpectedToHaveBeenCalledWith:
      'Missing `toHaveBeenCalledWith` for amount of times called.  If the function is called with the same arguments more than once, consider using `toHaveBeenNthCalledWith` to explicitly list each call.',
    notAllToHaveBeenNthCalledWithListed:
        '`toHaveBeenNthCalledWith` needs to be explicit with each function call, and match the number of `toHaveBeenCalledTimes`',
    outOfOrderNthCalledWith: 'Please order the `toHaveBeenNthCalledWith` numerically',
}

module.exports = {
    messages,

    toHaveBeenCalledTimes,
    toHaveBeenCalledWith,
    toHaveBeenNthCalledWith,
}
