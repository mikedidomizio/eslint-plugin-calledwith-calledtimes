import { toHaveBeenNthCalledWith } from './constants';

import { getNextNode, getNodePropertyName } from './helpers';
import { Rule } from 'eslint';
import RuleFixer = Rule.RuleFixer;
import RuleContext = Rule.RuleContext;

/**
 * Returns a fixer array that swaps the lines of two nodes
 * @deprecated	Consider using `getFixesForLastCalledWithAtEnd` or create a better solution
 * @param {*} fixer
 * @param {*} context
 * @param {*} node
 * @param {*} nextNode
 * @returns
 */
const swapLines = (fixer: RuleFixer,
									 context: RuleContext, node: Rule.Node, nextNode: Rule.Node) => {
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

const getFixesForLastCalledWithAtEnd = (fixer: RuleFixer, context: RuleContext, node: Rule.Node, nextNode: Rule.Node) => {
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

export {
	getFixesForLastCalledWithAtEnd,
	swapLines,
};
