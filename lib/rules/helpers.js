const { toHaveBeenCalledTimes } = require('./constants')


const getPreviousNode = (node, index = 1) => {
	const parent = node.parent;
	const siblings = parent.body || parent.consequent || [];
	const currentIndex = siblings.indexOf(node);
	return siblings[currentIndex - index] || null;
};

const getNextNode = (node, index = 1) => {
	const parent = node.parent;
	const siblings = parent.body || parent.consequent || [];
	const currentIndex = siblings.indexOf(node);
	return siblings[currentIndex + index] || null;
};

const getNodePropertyName = (node) => {
	return node?.expression?.callee?.property?.name || null;
};

const getArgsOfExpectCall = (node) => {
	if (node?.expression?.callee?.object?.arguments) {
		return node?.expression.callee.object.arguments[0].name || null;
	}

	return null
};

const getNumberOfTimesCalled = (node) => {
	if (node?.expression?.callee?.property?.name !== 'toHaveBeenCalledTimes') {
		throw new Error('Passing in a node that does not contain `toHaveBeenCalledTimes`');
	}

	return node?.expression.arguments[0].value;
};

const getNumberOfNthCalledWith = (node) => {
	if (node?.expression?.callee?.property.name !== 'toHaveBeenNthCalledWith') {
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
const getEventuallyCalledTimesExists = (node, acceptableNodePropertyNames = []) => {
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

const getEventuallyCalledTimesExistsBefore = (node, acceptableNodePropertyNames = []) => {
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
const getErrorMessageObject = (options, fallbackMessage) => {
	return {
		message: options?.reportMessage ? options.reportMessage : fallbackMessage,
	};
};

function arrIdentical(a1, a2) {
	// Tim Down: http://stackoverflow.com/a/7837725/308645
	var i = a1.length;
	if (i !== a2.length) return false;
	while (i--) {
		if (a1[i] !== a2[i]) return false;
	}
	return true;
}

module.exports = {
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
