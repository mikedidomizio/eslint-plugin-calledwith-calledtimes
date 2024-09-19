const {
	getErrorMessageObject,
	getEventuallyCalledTimesExists,
	getEventuallyCalledTimesExistsBefore,
	getArgsOfExpectCall,
	getNodePropertyName,
	getNextNode,
	getNodeNthCalledWithIsOrdered,
	getNumberOfNthCalledWith,
	getNumberOfTimesCalled,
	getPreviousNode,
} = require('./helpers');

const {
	messages,

	toHaveBeenCalledTimes,
	toHaveBeenCalledWith,
	toHaveBeenNthCalledWith
} = require('./constants');

const { swapLines } = require('./fixer-helpers');

module.exports = {
	meta: {
		type: 'suggestion',
		messages,
		docs: {
			description: 'Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes`',
		},
		schema: [{}],
		fixable: 'code',
	},
	create(context) {
		const options = context.options[0]

		return {
			ExpressionStatement: function (node) {
				const nodeName = getNodePropertyName(node);
				const previousNode = getPreviousNode(node);
				const nextNode = getNextNode(node);

				if (nodeName === toHaveBeenCalledWith) {
					if (nextNode && ![toHaveBeenCalledTimes, toHaveBeenCalledWith].includes(getNodePropertyName(nextNode))) {
						return context.report({
							node: nextNode,
							...getErrorMessageObject(options, 'missingToHaveBeenCalledTimes'),
						});
					}

					if (!nextNode || !getEventuallyCalledTimesExists(node, [toHaveBeenCalledWith])) {
						if (getNodePropertyName(previousNode) !== toHaveBeenCalledTimes) {
							return context.report({
								node,
								...getErrorMessageObject(options, 'missingToHaveBeenCalledTimes'),
							});
						}
					}
				}

				if (nodeName === toHaveBeenNthCalledWith) {
					if (nextNode && ![toHaveBeenCalledTimes, toHaveBeenNthCalledWith].includes(getNodePropertyName(nextNode))) {
						return context.report({
							node: nextNode,
							...getErrorMessageObject(options, 'missingToHaveBeenNthCalledTimes'),
						});
					}

					if (!nextNode || !getEventuallyCalledTimesExists(node, [toHaveBeenNthCalledWith])) {
						if (!getEventuallyCalledTimesExistsBefore(node, [toHaveBeenNthCalledWith])) {
							return context.report({
								node,
								...getErrorMessageObject(options, 'missingToHaveBeenNthCalledTimes'),
							});
						}
					}

					if (options?.toHaveBeenNthCalledWith?.strictOrderOfNthCalledWith) {
						const numberNthCalledWith = getNumberOfNthCalledWith(node);

						if (numberNthCalledWith === 1) {
							const { isOrdered, offendingNode } = getNodeNthCalledWithIsOrdered(node);

							if (!isOrdered && !offendingNode) {
								throw new Error('Need to report an offending node with the report. This is not an error with your code, but an error with the ESLint plugin `eslint-plugin-calledwith-calledtimes`');
							}

							if (!isOrdered) {
								return context.report({
									node: offendingNode,
									...getErrorMessageObject(options, 'outOfOrderNthCalledWith'),
								});
							}
						}
					}
				}

				if (nodeName === toHaveBeenCalledTimes) {
					if (!previousNode) {
						if (getNodePropertyName(nextNode) === toHaveBeenCalledWith) {
							return context.report({
								node,
								...getErrorMessageObject(options, 'missingToHaveBeenCalledWith'),
								fix(fixer) {
									return swapLines(fixer, context, node, nextNode);
								},
							});
						} else if (
							!nextNode ||
							(getNodePropertyName(nextNode) !== toHaveBeenCalledWith &&
								getNodePropertyName(nextNode) !== toHaveBeenNthCalledWith)
						) {
							return context.report({
								node,
								...getErrorMessageObject(options, 'missingToHaveBeenCalledWith'),
							});
						}

						if (getNodePropertyName(nextNode) === toHaveBeenNthCalledWith) {
							return context.report({
								node,
								...getErrorMessageObject(options, 'missingToHaveBeenNthCalledWith'),
								fix(fixer) {
									let fixes = []
									// we need to find the last toHaveBeenNthCalledWith
									let foundLastNthCalledWith = false
									let tmpNode = nextNode
									while(!foundLastNthCalledWith) {
										const nextNode = getNextNode(tmpNode)
										const nextNodePropertyName = getNodePropertyName(nextNode)

										if (nextNodePropertyName !== toHaveBeenNthCalledWith) {
											foundLastNthCalledWith = true
										} else {
											tmpNode = nextNode
										}
									}

									const nodeText = context.sourceCode.getText(node);
									const tmpNodeText = context.sourceCode.getText(tmpNode);

									fixes.push(fixer.remove(node), fixer.insertTextAfter(node, tmpNodeText));
									fixes.push(fixer.remove(tmpNode), fixer.insertTextAfter(tmpNode, nodeText));

									return fixes
								},
							});
						} else if (
							!nextNode ||
							(getNodePropertyName(nextNode) !== toHaveBeenCalledWith &&
								getNodePropertyName(nextNode) !== toHaveBeenNthCalledWith)
						) {
							return context.report({
								node,
								...getErrorMessageObject(options, 'missingToHaveBeenNthCalledWith'),
							});
						}
					} else {
						// determine if the arg matches between the two matchers
						if (getArgsOfExpectCall(node) !== getArgsOfExpectCall(previousNode)) {
							return context.report({
								node,
								...getErrorMessageObject(options, 'identifiersAreNotMatching'),
							});
						}

						if (options?.toHaveBeenCalledWith?.strictNumberOfCalledWithMatchesCalledTimes) {
							const numberOfTimesCalled = getNumberOfTimesCalled(node);
							const previousNodes = new Array(parseInt(numberOfTimesCalled, 10))
								.fill(null)
								.map((_i, index) => getPreviousNode(node, index + 1));
							const hasMissingNodes = previousNodes.some((curNode) => {
								// note: the second part of this will be caught in a separate check, so it's not really necessary but we'll keep it in for now.
								return curNode === null || getNodePropertyName(curNode) !== toHaveBeenCalledWith;
							});

							if (hasMissingNodes) {
								return context.report({
									node,
									...getErrorMessageObject(options, 'missingExpectedToHaveBeenCalledWith'),
								});
							}
						}

						if (options?.toHaveBeenNthCalledWith?.strictNumberOfCalledWithMatchesCalledTimes) {
							const numberOfTimesCalled = getNumberOfTimesCalled(node);
							const previousNodes = new Array(parseInt(numberOfTimesCalled, 10))
								.fill(null)
								.map((_i, index) => getPreviousNode(node, index + 1));
							const hasMissingNodes = previousNodes.some((curNode) => {
								return curNode === null || getNodePropertyName(curNode) !== toHaveBeenNthCalledWith;
							});

							if (hasMissingNodes) {
								return context.report({
									node,
									...getErrorMessageObject(options, 'missingExpectedToHaveBeenNthCalledWith'),
								});
							}
						}
					}
				}
			},
		};
	},
};
