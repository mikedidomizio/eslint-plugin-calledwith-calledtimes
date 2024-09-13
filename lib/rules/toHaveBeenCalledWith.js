const { getErrorMessageObject, getNodePropertyName, getNextNode } = require('./helpers');

module.exports = {
	meta: {
		type: 'suggestion',
		messages: {
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			generic: `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
		},
		docs: {
			description: 'Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes`',
		},
		schema: [{}],
	},
	create(context) {
		return {
			ExpressionStatement: function (node) {
				const nodeName = getNodePropertyName(node);

				if (nodeName === 'toHaveBeenCalledWith') {
					const nextNode = getNextNode(node.parent, node);

					if (!nextNode || getNodePropertyName(nextNode) !== 'toHaveBeenCalledTimes') {
						context.report({
							node,
							...getErrorMessageObject(node, context.options),
						});
					}
				}
			},
		};
	},
};
