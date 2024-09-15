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
		const toHaveBeenCalledWith = 'toHaveBeenCalledWith';
		const toHaveBeenCalledTimes = 'toHaveBeenCalledTimes';

		return {
			ExpressionStatement: function (node) {
				const nodeName = getNodePropertyName(node);

				if (nodeName === toHaveBeenCalledWith) {
					const nextNode = getNextNode(node);

					if (!nextNode || getNodePropertyName(nextNode) !== toHaveBeenCalledTimes) {
						const previousNode = getPreviousNode(node)

						// we want to make sure that if the previous node was toHaveBeenCalledTimes that we don't report two errors when it's just one.
						if (getNodePropertyName(previousNode) !== toHaveBeenCalledTimes) {
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenCalledTimes'),
							});
						}
					}
				}

				if (nodeName === toHaveBeenCalledTimes) {
					const previousNode = getPreviousNode(node)

					if ((!previousNode || getNodePropertyName(previousNode) !== toHaveBeenCalledWith)) {
						const nextNode = getNextNode(node);

						if (getNodePropertyName(nextNode) === toHaveBeenCalledWith) {
							context.report({
								node,
								...getErrorMessageObject(node, context.options, 'missingToHaveBeenCalledWith'),
								fix(fixer) {
									// Generate the fixes to swap the lines
									const fixes = [];

									// get the source code of both lines so we can insert them in the right place
									const nodeText = context.sourceCode.getText(node)
									const nextNodeText = context.sourceCode.getText(nextNode)

									// removes the first node and put the second node in its place
									fixes.push(
										fixer.remove(node),
										fixer.insertTextAfter(node, nextNodeText)
									)

									// removes the second node and puts the first node in its place
									fixes.push(
										fixer.remove(nextNode),
										fixer.insertTextAfter(nextNode, nodeText)
									)

									return fixes
								}
							});
						} else if (!nextNode || getNodePropertyName(nextNode) !== toHaveBeenCalledWith) {
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
