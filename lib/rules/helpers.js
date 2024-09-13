const getPreviousNode = (nodes, node) => {
	const index = nodes.body.findIndex((n) => n.range === node.range);
	return nodes.body[index - 1] || null;
};

const getNextNode = (nodes, node) => {
	const index = nodes.body.findIndex((n) => n.range === node.range);
	return nodes.body[index + 1] || null;
};

const getNodePropertyName = (node) => {
	return node?.expression?.callee?.property?.name || null;
};

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
	getNextNode,
	getNodePropertyName,
	getPreviousNode,
};
