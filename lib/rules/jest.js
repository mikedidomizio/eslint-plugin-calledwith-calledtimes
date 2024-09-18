const {
	getErrorMessageObject,
	getEventuallyCalledTimesExists,
	getIdentifier,
	getNodePropertyName,
	getNextNode,
	getNodeNthCalledWithIsOrdered,
	getNumberOfNthCalledWith,
	getNumberOfTimesCalled,
	getPreviousNode,
} = require('./helpers');

const { swapLines } = require('./fixer-helpers');

module.exports = {
	meta: {
		type: 'suggestion',
		messages: {
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			missingToHaveBeenCalledTimes: `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			missingToHaveBeenCalledWith: `Adding \`.toHaveBeenCalledWith()\` before \`toHaveBeenCalledTimes()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			missingExpectedToHaveBeenCalledWith:
				'Missing `toHaveBeenCalledWith` for amount of times called, consider using `toHaveBeenNthCalledWith`',

			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			missingToHaveBeenNthCalledTimes: `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenNthCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			missingToHaveBeenNthCalledWith: `Adding \`.toHaveBeenNthCalledWith()\` before \`toHaveBeenCalledTimes()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			missingExpectedToHaveBeenNthCalledWith:
				'`toHaveBeenNthCalledWith` needs to be explicit and match the number of `toHaveBeenCalledTimes`',
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			outOfOrderNthCalledWith: 'Please order the `toHaveBeenNthCalledWith` numerically',

			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			identifiersAreNotMatching: `Please add the matching argument for expect(ARG).toHaveBeenCalledTimes`,
		},
		docs: {
			description: 'Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes`',
		},
		schema: [
			{
				type: 'object',
				additionalProperties: false,
				properties: {
					toHaveBeenCalledWith: {
						description: 'Rules that relate to the toHaveBeenCalledWith matcher',
						type: 'object',
						additionalProperties: false,
						properties: {
							strictNumberOfCalledWithMatchesCalledTimes: {
								description: 'The number of toHaveBeenCalledWith matches the number specified in toHaveBeenCalledTimes',
								type: 'boolean',
							},
						},
					},
					toHaveBeenNthCalledWith: {
						description: 'Rules that relate to the toHaveBeenNthCalledWith matcher',
						type: 'object',
						additionalProperties: false,
						properties: {
							strictNumberOfCalledWithMatchesCalledTimes: {
								description:
									'The number of toHaveBeenNthCalledWith matches the number specified in toHaveBeenCalledTimes',
								type: 'boolean',
							},
							strictOrderOfNthCalledWith: {
								description: 'The order of toHaveBeenNthCalledWith is ordered numerically',
								type: 'boolean',
							},
						},
					},
					reportMessage: {
						description: 'The error message that will be reported',
						type: 'string',
					},
				},
			},
		],
		fixable: 'code',
	},
	create(context) {
		const toHaveBeenCalledWith = 'toHaveBeenCalledWith';
		const toHaveBeenNthCalledWith = 'toHaveBeenNthCalledWith';
		const toHaveBeenCalledTimes = 'toHaveBeenCalledTimes';

		return {
			ExpressionStatement: function (node) {
				const nodeName = getNodePropertyName(node);
				const previousNode = getPreviousNode(node);
				const nextNode = getNextNode(node);

				if (nodeName === toHaveBeenCalledWith) {
					if (nextNode && ![toHaveBeenCalledTimes, toHaveBeenCalledWith].includes(getNodePropertyName(nextNode))) {
						context.report({
							node: nextNode,
							...getErrorMessageObject(context.options, 'missingToHaveBeenCalledTimes'),
						});
						return;
					}

					if (!nextNode || !getEventuallyCalledTimesExists(node, [toHaveBeenCalledWith])) {
						if (getNodePropertyName(previousNode) !== toHaveBeenCalledTimes) {
							context.report({
								node,
								...getErrorMessageObject(context.options, 'missingToHaveBeenCalledTimes'),
							});
							return;
						}
					}
				}

				if (nodeName === toHaveBeenNthCalledWith) {
					if (nextNode && ![toHaveBeenCalledTimes, toHaveBeenNthCalledWith].includes(getNodePropertyName(nextNode))) {
						context.report({
							node: nextNode,
							...getErrorMessageObject(context.options, 'missingToHaveBeenNthCalledTimes'),
						});
						return;
					}

					if (!nextNode || !getEventuallyCalledTimesExists(node, [toHaveBeenNthCalledWith])) {
						if (getNodePropertyName(previousNode) !== toHaveBeenCalledTimes) {
							context.report({
								node,
								...getErrorMessageObject(context.options, 'missingToHaveBeenNthCalledTimes'),
							});
							return;
						}
					}

					if (context.options[0]?.toHaveBeenNthCalledWith?.strictOrderOfNthCalledWith) {
						const numberNthCalledWith = getNumberOfNthCalledWith(node);

						if (numberNthCalledWith === 1) {
							const { isOrdered, offendingNode } = getNodeNthCalledWithIsOrdered(node);

							if (!isOrdered && !offendingNode) {
								throw new Error('Need to report an offendingNode with the report');
							}

							if (!isOrdered) {
								context.report({
									node: offendingNode,
									...getErrorMessageObject(context.options, 'outOfOrderNthCalledWith'),
								});
								return;
							}
						}
					}
				}

				if (nodeName === toHaveBeenCalledTimes) {
					if (!previousNode) {
						if (getNodePropertyName(nextNode) === toHaveBeenCalledWith) {
							context.report({
								node,
								...getErrorMessageObject(context.options, 'missingToHaveBeenCalledWith'),
								fix(fixer) {
									return swapLines(fixer, context, node, nextNode);
								},
							});
						} else if (
							!nextNode ||
							(getNodePropertyName(nextNode) !== toHaveBeenCalledWith &&
								getNodePropertyName(nextNode) !== toHaveBeenNthCalledWith)
						) {
							context.report({
								node,
								...getErrorMessageObject(context.options, 'missingToHaveBeenCalledWith'),
							});
							return; // If we have reported we don't want to continue after this.
						}

						if (getNodePropertyName(nextNode) === toHaveBeenNthCalledWith) {
							context.report({
								node,
								...getErrorMessageObject(context.options, 'missingToHaveBeenNthCalledWith'),
								fix(fixer) {
									return swapLines(fixer, context, node, nextNode);
								},
							});
						} else if (
							!nextNode ||
							(getNodePropertyName(nextNode) !== toHaveBeenCalledWith &&
								getNodePropertyName(nextNode) !== toHaveBeenNthCalledWith)
						) {
							context.report({
								node,
								...getErrorMessageObject(context.options, 'missingToHaveBeenNthCalledWith'),
							});
							return; // If we have reported we don't want to continue after this.
						}
					} else {
						// determine if the arg matches between the two matchers
						const nodeIdentifier = getIdentifier(node);
						const prevNodeIdentifier = getIdentifier(previousNode);

						if (nodeIdentifier !== prevNodeIdentifier) {
							context.report({
								node,
								...getErrorMessageObject(context.options, 'identifiersAreNotMatching'),
							});
							return; // If we have reported we don't want to continue after this.
						}

						if (context.options[0]?.toHaveBeenCalledWith?.strictNumberOfCalledWithMatchesCalledTimes) {
							const numberOfTimesCalled = getNumberOfTimesCalled(node);
							const previousNodes = new Array(parseInt(numberOfTimesCalled, 10))
								.fill(null)
								.map((_i, index) => getPreviousNode(node, index + 1));
							const hasMissingNodes = previousNodes.some((curNode) => {
								// note: the second part of this will be caught in a separate check, so it's not really necessary but we'll keep it in for now.
								return curNode === null || getNodePropertyName(curNode) !== toHaveBeenCalledWith;
							});

							if (hasMissingNodes) {
								context.report({
									node,
									...getErrorMessageObject(context.options, 'missingExpectedToHaveBeenCalledWith'),
								});
							}
						}

						if (context.options[0]?.toHaveBeenNthCalledWith?.strictNumberOfCalledWithMatchesCalledTimes) {
							const numberOfTimesCalled = getNumberOfTimesCalled(node);
							const previousNodes = new Array(parseInt(numberOfTimesCalled, 10))
								.fill(null)
								.map((_i, index) => getPreviousNode(node, index + 1));
							const hasMissingNodes = previousNodes.some((curNode) => {
								return curNode === null || getNodePropertyName(curNode) !== toHaveBeenNthCalledWith;
							});

							if (hasMissingNodes) {
								context.report({
									node,
									...getErrorMessageObject(context.options, 'missingExpectedToHaveBeenNthCalledWith'),
								});
							}
						}
					}
				}
			},
		};
	},
};
