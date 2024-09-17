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

module.exports = {
	swapLines,
};
