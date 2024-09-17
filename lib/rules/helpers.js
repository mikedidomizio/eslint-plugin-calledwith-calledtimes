const getPreviousNode = (node) => {
	const parent = node.parent
	const siblings = parent.body || parent.consequent || []
	const currentIndex = siblings.indexOf(node)
	return siblings[currentIndex - 1]
};

const getNextNode = (node) => {
	const parent = node.parent
	const siblings = parent.body || parent.consequent || []
	const currentIndex = siblings.indexOf(node)
	return siblings[currentIndex + 1]
}

const getNodePropertyName = (node) => {
	return node?.expression?.callee?.property?.name || null;
};

const getIdentifier = (node) => {
	return node?.expression.callee?.object.arguments[0].name || null
}

const getErrorMessageObject = (node, options, fallbackMessageId) => {
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
	getIdentifier,
	getNextNode,
	getNodePropertyName,
	getPreviousNode,
};
