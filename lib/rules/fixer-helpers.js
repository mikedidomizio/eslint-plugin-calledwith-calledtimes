const {
	getNodePropertyName,
	getNextNode,
} = require('./helpers');

const {
	toHaveBeenNthCalledWith
} = require('./constants');

/**
 * Returns a fixer array that swaps the lines of two nodes
 * @param {*} fixer
 * @param {*} context
 * @param {*} node
 * @param {*} nextNode
 * @returns
 */
const swapLines = (fixer, context, node, nextNode) => {
	const fixes = [];

	// get the source code of both lines so we can insert them in the right place
	const nodeText = context.sourceCode.getText(node);
	const nextNodeText = context.sourceCode.getText(nextNode);

	// removes the first node and put the second node in its place
	fixes.push(fixer.remove(node), fixer.insertTextAfter(node, nextNodeText));

	// removes the second node and puts the first node in its place
	fixes.push(fixer.remove(nextNode), fixer.insertTextAfter(nextNode, nodeText));

	return fixes;
};

const getFixesForLastCalledWithAtEnd = (fixer, context, node, nextNode) => {
	// we need to find the last toHaveBeenNthCalledWith
	let foundLastNthCalledWith = false
	let tmpNode = nextNode
	while(!foundLastNthCalledWith) {
		const tmpNextNode = getNextNode(tmpNode)
		const tmpNextNodePropertyName = getNodePropertyName(tmpNextNode)

		if (tmpNextNodePropertyName !== toHaveBeenNthCalledWith) {
			foundLastNthCalledWith = true
		} else {
			tmpNode = tmpNextNode
		}
	}

	const nodeText = context.sourceCode.getText(node);
	const tmpNodeText = context.sourceCode.getText(tmpNode);

	const fixes = []

	fixes.push(fixer.remove(node), fixer.insertTextAfter(node, tmpNodeText));
	fixes.push(fixer.remove(tmpNode), fixer.insertTextAfter(tmpNode, nodeText));

	return fixes
}

module.exports = {
	getFixesForLastCalledWithAtEnd,
	swapLines,
};
