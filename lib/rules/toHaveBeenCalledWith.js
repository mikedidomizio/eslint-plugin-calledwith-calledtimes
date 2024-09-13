const { getErrorMessageObject, getNodePropertyName, getNextNode, getPreviousNode } = require('./helpers');

module.exports = {
	meta: {
		type: 'suggestion',
		messages: {
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			missingToHaveBeenCalledTimes: `Adding \`.toHaveBeenCalledTimes()\` after \`toHaveBeenCalledWith()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
			// eslint-disable-next-line eslint-plugin/no-unused-message-ids
			missingToHaveBeenCalledWith: `Adding \`.toHaveBeenCalledWith()\` before \`toHaveBeenCalledTimes()\` ensures that a function is called with a specific set of arguments, and a specific amount of times. This ensures that a function is called no more or no less than what is expected.`,
		},
		docs: {
			description: 'Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes`',
		},
		schema: [{}],
		fixable: 'code'
	},
	create(context) {
		return {
			ExpressionStatement: function (node) {
				const nodeName = getNodePropertyName(node);

				if (nodeName === 'toHaveBeenCalledWith') {
					const nextNode = getNextNode(node.parent, node);

					if (!nextNode || getNodePropertyName(nextNode) !== 'toHaveBeenCalledTimes') {
						const sourceCode = context.getSourceCode();
						console.log('reported 0')

						const lines = sourceCode.getLines();
						const [line1Text, line2Text, line3Text, line4Text] = lines;

						// context.report({
						// 	node,
						// 	...getErrorMessageObject(node, context.options, 'missingToHaveBeenCalledTimes'),
						// });
					}
				}

				if (nodeName === 'toHaveBeenCalledTimes') {
					const previousNode = getPreviousNode(node.parent, node)

					if ((!previousNode || getNodePropertyName(previousNode) !== 'toHaveBeenCalledWith')) {
						const nextNode = getNextNode(node.parent, node);

						// todo is this cleaner for getting the next node?
						// const parent = node.parent
						// const siblings = parent.body || parent.consequent || []
						// const currentIndex = siblings.indexOf(node)
						// const nextNode = siblings[currentIndex + 1]

						if (getNodePropertyName(nextNode) === 'toHaveBeenCalledWith') {
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenCalledWith'),
								fix(fixer) {
									// Generate the fixes to swap the lines
									const fixes = [];

									// get the source code of both
									const nodetext = context.sourceCode.getText(node)
									const nextNodeText = context.sourceCode.getText(nextNode)

									// removes the first node and put the second node in its place
									fixes.push(
										fixer.remove(node),
										fixer.insertTextAfter(node, nextNodeText)
									)

									// removes the second node and puts the first node in its place
									fixes.push(
										fixer.remove(nextNode),
										fixer.insertTextAfter(nextNode, nodetext)
									)

									return fixes
								}
							});
						} else if (!nextNode || getNodePropertyName(nextNode) !== 'toHaveBeenCalledWith') {
							// if the next node is toHaveBeenCalledWith we want it to be flipped
							// and don't need two errors
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenCalledWith'),
							});
						}
					}
				}
			},
		};
	},
};
