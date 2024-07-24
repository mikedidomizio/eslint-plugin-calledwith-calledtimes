const getNextNode = (nodes, node) => {
	const index = nodes.body.findIndex((n) => n.range === node.range);
	return nodes.body[index + 1] || null;
};

const getNodePropertyName = (node) => {
	return node.expression?.callee?.property?.name || null
}

module.exports = {
	meta: {
		type: 'suggestion',
		messages: {
			generic: `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
			genericNth: `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenNthCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`
		},
		docs: {
			description: 'Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes`',
		},
		schema: [{}],
	},
	create(context) {
		return {
			ExpressionStatement: function (node) {
				const nodeName = getNodePropertyName(node)

				if (nodeName === 'toHaveBeenCalledWith' || nodeName === 'toHaveBeenNthCalledWith') {
					const nextNode = getNextNode(node.parent, node);

					if (!nextNode || getNodePropertyName(nextNode) !== 'toHaveBeenCalledTimes') {
						context.report({
							node,
							messageId: nodeName === 'toHaveBeenNthCalledWith' ? "genericNth" : "generic",
						});
					}
				}
			},
		};
	},
};
