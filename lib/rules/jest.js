const getNextNode = (nodes, node) => {
	const index = nodes.body.findIndex((n) => n.range === node.range);
	return nodes.body[index + 1] || null;
};

module.exports = {
	meta: {
		type: 'suggestion',
		messages: {
			generic: `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`
		},
		docs: {
			description: 'Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes`',
		},
		schema: [{}],
	},
	create(context) {
		return {
			ExpressionStatement: function (node) {
				if (node.expression?.callee?.property?.name === 'toHaveBeenCalledWith') {
					const nextNode = getNextNode(node.parent, node);

					if (!nextNode || nextNode?.expression?.callee?.property?.name !== 'toHaveBeenCalledTimes') {
						context.report({
							node,
							messageId: "generic",
						});
					}
				}
			},
		};
	},
};
