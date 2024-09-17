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

const getIdentifier = (node) => {
	return node?.expression.callee?.object.arguments[0].name || null;
};

const getNumberOfTimesCalled = (node) => {
	return node?.expression.arguments[0].value;
};

const getNumberOfNthCalledWith = (node) => {
	return node?.expression.arguments[0].value;
};

const getNodeNthCalledWithIsOrdered = (node) => {
	let isOrdered = false
	let loop = true
	// this should be 1, and we should only call with the first one but let's fail here hard if not.
	// this would be a problem with this rule and not the person's code
	const nodeNthCalledWith = getNumberOfNthCalledWith(node)

	if (nodeNthCalledWith !== 1) {
		throw new Error('this should only ever be called with `1` so we step ahead')
	}

	// initial check if there are any before that would instantly fail this
	// before we consider everything good, let's check the previous node to see if it was a `toHaveBeenNthCalledWith`.
	const previousNode = getPreviousNode(node)
	const previousNodePropertyName = getNodePropertyName(previousNode);

	if (previousNodePropertyName === 'toHaveBeenNthCalledWith') {
		return false
	}

	let nthCalledWith = 2

	while (loop) {
		const currentNode = getNextNode(node, nthCalledWith);
		const nextNodePropertyName = getNodePropertyName(currentNode);

		if (nextNodePropertyName === 'toHaveBeenNthCalledWith') {
			const nextNodeNthCalledWith = getNumberOfNthCalledWith(currentNode);

			if (nextNodeNthCalledWith !== nthCalledWith) {
				loop = false
			} else {
				nthCalledWith++
			}
		} else if (nextNodePropertyName === 'toHaveBeenCalledTimes') {
			isOrdered = true
			loop = false
		} else {
			loop = false
		}
	}

	return isOrdered
}

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

		if (nextNodePropertyName === 'toHaveBeenCalledTimes') {
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

const getErrorMessageObject = (options, fallbackMessageId) => {
	const generalMessages = {
		messageId: fallbackMessageId,
	};

	const customReportMessage = {
		message: options[0]?.reportMessage,
	};

	return customReportMessage.message ? customReportMessage : generalMessages;
};

module.exports = {
	getErrorMessageObject,
	getEventuallyCalledTimesExists,
	getIdentifier,
	getNextNode,
	getNodeNthCalledWithIsOrdered,
	getNumberOfNthCalledWith,
	getNumberOfTimesCalled,
	getNodePropertyName,
	getPreviousNode,
};
