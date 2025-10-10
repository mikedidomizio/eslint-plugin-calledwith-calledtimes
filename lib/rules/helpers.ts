import { toHaveBeenCalledTimes } from './constants';
import { Rule } from 'eslint';
import ESTree, { CallExpression, ExpressionStatement } from 'estree';

const getPreviousNode = (node: Rule.Node, index = 1) => {
	const parent = node.parent;
	if ('body' in parent) {
		const siblings = parent.body || [];
		const currentIndex = siblings.indexOf(node);
		return siblings[currentIndex - index] || null;
	} else if ('consequent' in parent) {
		const siblings = parent.consequent || [];
		const currentIndex = siblings.indexOf(node);
		return siblings[currentIndex - index] || null;
	}

	return null
};

const getNextNode = (node: Rule.Node, index = 1) => {
	const parent = node.parent;
	if ('body' in parent && 'consequent' in parent) {
		const siblings = parent.body || parent.consequent || [];

		if (Array.isArray(siblings)) {
			const currentIndex = siblings.indexOf(node);
			return siblings[currentIndex + index] || null;
		}
	}
};

const getNodePropertyName = (node: ExpressionStatement) => {
	if (node && 'callee' in node.expression && 'property' in node.expression.callee && 'name' in node.expression.callee.property) {
		return node.expression.callee.property.name;
	}

	return null
};

const getArgsOfExpectCall = (node: ExpressionStatement) => {
	if (node && 'expression' in node && 'callee' in node.expression && 'object' in node.expression.callee && 'arguments' in node.expression.callee.object && 'name' in node.expression.callee.object.arguments[0]) {
		return node?.expression.callee.object.arguments[0].name;
	}

	return null
};

const getNumberOfTimesCalled = (node: ExpressionStatement) => {
	if (node && 'expression' in node && 'callee' in node.expression && 'property' in node.expression.callee && node?.expression?.callee?.property?.name !== 'toHaveBeenCalledTimes') {
		throw new Error('Passing in a node that does not contain `toHaveBeenCalledTimes`');
	}

	return node?.expression.arguments[0].value;
};

const getNumberOfNthCalledWith = (node: ExpressionStatement) => {
	if (node && 'expression' in node && 'callee' in node.expression && node?.expression?.callee?.property.name !== 'toHaveBeenNthCalledWith') {
		throw new Error('Passing in a node that does not contain `toHaveBeenCalledWith`');
	}

	return node?.expression.arguments[0].value;
};

/**
 * Traverses node after node to see if `toHaveBeenCalledTimes` is where it should be (after toHaveBeen(Nth)CalledWith)
 * @param node
 * @param acceptableNodePropertyNames	An array of acceptable node property names which if the next node is one of these, it will continue. Everything else is considered bad.
 * @return {boolean}	Whether the `toHaveBeenCalledTimes` follows `toHaveBeen(Nth)CalledWith`
 */
const getEventuallyCalledTimesExists = (node: Rule.Node, acceptableNodePropertyNames: string[] = []) => {
	let found = false;
	let loop = true;
	let nodeIndex = 1;

	while (loop) {
		const nextNode = getNextNode(node, nodeIndex);
		const nextNodePropertyName = getNodePropertyName(nextNode);

		if (nextNodePropertyName === toHaveBeenCalledTimes) {
			found = true;
			loop = false;
		} else if (acceptableNodePropertyNames.includes(nextNodePropertyName)) {
			loop = true;
			nodeIndex++;
		} else {
			loop = false;
		}
	}

	return found;
};

const getEventuallyCalledTimesExistsBefore = (node: Rule.Node, acceptableNodePropertyNames: string[] = []) => {
	let found = false;
	let loop = true;
	let nodeIndex = 1;

	while (loop) {
		const nextNode = getPreviousNode(node, nodeIndex);
		const nextNodePropertyName = getNodePropertyName(nextNode);

		if (nextNodePropertyName === toHaveBeenCalledTimes) {
			found = true;
			loop = false;
		} else if (acceptableNodePropertyNames.includes(nextNodePropertyName)) {
			loop = true;
			nodeIndex++;
		} else {
			loop = false;
		}
	}

	return found;
};

/**
 * @param {object} options
 * @param {string} fallbackMessage
 * @return {{message: (string|*|null)}|{messageId}}
 */
const getErrorMessageObject = (options: { reportMessage: string }, fallbackMessage: string) => {
	return {
		message: options?.reportMessage ? options.reportMessage : fallbackMessage,
	};
};

function arrIdentical(a1: any[], a2: any[]) {
	// Tim Down: http://stackoverflow.com/a/7837725/308645
	var i = a1.length;
	if (i !== a2.length) return false;
	while (i--) {
		if (a1[i] !== a2[i]) return false;
	}
	return true;
}

export {
	arrIdentical,
	getErrorMessageObject,
	getEventuallyCalledTimesExists,
	getEventuallyCalledTimesExistsBefore,
	getArgsOfExpectCall,
	getNextNode,
	getNumberOfNthCalledWith,
	getNumberOfTimesCalled,
	getNodePropertyName,
	getPreviousNode,
};
