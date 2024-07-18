const getNextNode = (nodes, node) => {
	const index = nodes.body.findIndex(n => n.range === node.range)
	return nodes.body[index + 1] || null
}

const message = `Pairing toHaveBeenCalledWith with toHaveBeenCalledTimes ensures that a function is called with a specific set of arguments, a specific amount of times. This ensures that a function is called no more or no less than what is expected.`

module.exports = {
	meta: {
		type: "suggestion",
		docs: {
			description: 'Ensures that using test matchers `toHaveBeenCalledWith` is always paired with `toHaveBeenCalledTimes`',
		},
		fixable: "code",
		schema: [
			{},
		],
	},
	create(context) {
		return {
			ExpressionStatement: function (node) {
				if (node.expression?.callee?.property?.name === 'toHaveBeenCalledWith') {
					const nextNode = getNextNode(node.parent, node)

					if (!nextNode || (nextNode?.expression?.callee?.property?.name !== 'toHaveBeenCalledTimes')) {
						context.report({
							node,
							message,
						})
					}
				}
			}
		};
	},
};
