const { getErrorMessageObject, getNodePropertyName, getNextNode, getPreviousNode } = require('./helpers');

const { swapLines } = require('./fixer-helpers')

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
		},
		docs: {
			description: 'Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes`',
		},
		schema: [{}],
		fixable: 'code'
	},
	create(context) {
		const toHaveBeenCalledWith = 'toHaveBeenCalledWith';
		const toHaveBeenNthCalledWith = 'toHaveBeenNthCalledWith'
		const toHaveBeenCalledTimes = 'toHaveBeenCalledTimes';

		return {
			ExpressionStatement: function (node) {
				const nodeName = getNodePropertyName(node);

				if (nodeName === toHaveBeenCalledWith) {
					const nextNode = getNextNode(node);

					if (!nextNode || getNodePropertyName(nextNode) !== toHaveBeenCalledTimes) {
						const previousNode = getPreviousNode(node)

						if (getNodePropertyName(previousNode) !== toHaveBeenCalledTimes) {
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenCalledTimes'),
							});
						}
					}
				}

                if (nodeName === toHaveBeenNthCalledWith) {
					const nextNode = getNextNode(node);

					if (!nextNode || getNodePropertyName(nextNode) !== toHaveBeenCalledTimes) {
						const previousNode = getPreviousNode(node)

						if (getNodePropertyName(previousNode) !== toHaveBeenCalledTimes) {
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenNthCalledTimes'),
							});
						}
					}
				}

				if (nodeName === toHaveBeenCalledTimes) {
					const previousNode = getPreviousNode(node)
                    let hasError = false;

					if (!previousNode) {
						const nextNode = getNextNode(node);

						if (getNodePropertyName(nextNode) === toHaveBeenCalledWith) {
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenCalledWith'),
								fix(fixer) {
                                    return swapLines(fixer, context, node, nextNode)
								}
							});
                            hasError = true
						} else if (!nextNode || (getNodePropertyName(nextNode) !== toHaveBeenCalledWith && getNodePropertyName(nextNode) !== toHaveBeenNthCalledWith)) {
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenCalledWith'),
							});
                            hasError = true
						}
					}

                    if (!hasError && (!previousNode)) {
						const nextNode = getNextNode(node);

						if (getNodePropertyName(nextNode) === toHaveBeenNthCalledWith) {
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenNthCalledWith'),
								fix(fixer) {
									return swapLines(fixer, context, node, nextNode)
								}
							});
						} else if (!nextNode || (getNodePropertyName(nextNode) !== toHaveBeenCalledWith && getNodePropertyName(nextNode) !== toHaveBeenNthCalledWith)) {
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenNthCalledWith'),
							});
						}
					}
				}
			},
		};
	},
};
