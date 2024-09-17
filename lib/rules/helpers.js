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
			nodeIndex += 1;
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
	getNumberOfTimesCalled,
	getNodePropertyName,
	getPreviousNode,
};
