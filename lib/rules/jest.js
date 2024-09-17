const {
	getErrorMessageObject,
	getIdentifier,
	getNodePropertyName,
	getNextNode,
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
			missingToHaveBeenNthCalledTimes: `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenNthCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			missingToHaveBeenNthCalledWith: `Adding \`.toHaveBeenNthCalledWith()\` before \`toHaveBeenCalledTimes()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			identifiersAreNotMatching: `Please add the matching argument for expect(ARG).toHaveBeenCalledTimes`,
		},
		docs: {
			description: 'Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes`',
		},
		schema: [{}],
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

					if (!nextNode || getNodePropertyName(nextNode) !== toHaveBeenCalledTimes) {
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
					if (!nextNode || getNodePropertyName(nextNode) !== toHaveBeenCalledTimes) {
						if (getNodePropertyName(previousNode) !== toHaveBeenCalledTimes) {
							context.report({
								node,
								...getErrorMessageObject(context.options, 'missingToHaveBeenNthCalledTimes'),
							});
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
					}
				}
			},
		};
	},
};
