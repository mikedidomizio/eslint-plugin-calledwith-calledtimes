import { Rule } from 'eslint'

import {
	arrIdentical,
	getErrorMessageObject,
	getEventuallyCalledTimesExists,
	getEventuallyCalledTimesExistsBefore,
	getArgsOfExpectCall,
	getNodePropertyName,
	getNextNode,
	getNumberOfNthCalledWith,
	getNumberOfTimesCalled,
	getPreviousNode,
} from './helpers';

// @ts-ignore
import { messages, toHaveBeenCalledTimes, toHaveBeenCalledWith, toHaveBeenNthCalledWith } from './constants';

// @ts-ignore
import { schema } from './schema';

// @ts-ignore
import { getFixesForLastCalledWithAtEnd, swapLines } from './fixer-helpers';

export default {
	meta: {
		type: 'suggestion',
		messages,
		docs: {
			description: 'Ensures that using test matcher `toHaveBeenCalledWith` is followed by `toHaveBeenCalledTimes`',
		},
		schema: [schema],
		fixable: 'code',
	},
	create(context: Rule.RuleContext) {
		const options = context.options[0]

		return {
			ExpressionStatement: function (node: Rule.Node) {
				const nodeName = getNodePropertyName(node);
				const previousNode = getPreviousNode(node);
				const nextNode = getNextNode(node);

				if (nodeName === toHaveBeenCalledWith) {
					if (nextNode && ![toHaveBeenCalledTimes, toHaveBeenCalledWith].includes(getNodePropertyName(nextNode))) {
						return context.report({
							node: nextNode,
							...getErrorMessageObject(options, messages.toHaveBeenCalledTimesNotAfter),
						});
					}

					if (!nextNode || !getEventuallyCalledTimesExists(node, [toHaveBeenCalledWith])) {
						if (getNodePropertyName(previousNode) !== toHaveBeenCalledTimes) {
							return context.report({
								node,
								...getErrorMessageObject(options, messages.toHaveBeenCalledTimesNotAfter),
							});
						}
					}
				}

				if (nodeName === toHaveBeenNthCalledWith) {
					if (nextNode && ![toHaveBeenCalledTimes, toHaveBeenNthCalledWith].includes(getNodePropertyName(nextNode))) {
						return context.report({
							node: nextNode,
							...getErrorMessageObject(options, messages.toHaveBeenCalledTimesNotAfterNth),
						});
					}

					if (!nextNode || !getEventuallyCalledTimesExists(node, [toHaveBeenNthCalledWith])) {
						if (!getEventuallyCalledTimesExistsBefore(node, [toHaveBeenNthCalledWith])) {
							return context.report({
								node,
								...getErrorMessageObject(options, messages.toHaveBeenCalledTimesNotAfterNth),
							});
						}
					}

					if (options?.toHaveBeenNthCalledWith?.strictOrderOfNthCalledWith) {
						// we start at the very start of the list and sort them
						if (getNodePropertyName(previousNode) !== toHaveBeenNthCalledWith) {
							const nthCalledWithOrder: number[] = [];
							let finishedGettingOrder = false;
							let curNode = node;
							while (!finishedGettingOrder) {
								const nthCalledWithNumber = getNumberOfNthCalledWith(curNode);
								nthCalledWithOrder.push(nthCalledWithNumber);
								const tmpNextNode = getNextNode(curNode);

								if (tmpNextNode && getNodePropertyName(tmpNextNode) === toHaveBeenNthCalledWith) {
									curNode = getNextNode(curNode);
								} else {
									finishedGettingOrder = true;
								}
							}

							const nthCalledWithOrderSorted = [...nthCalledWithOrder].sort((a, b) => a - b);

							if (arrIdentical(nthCalledWithOrder, nthCalledWithOrderSorted)) {
								return;
							}

							const nodeIndexToReport = nthCalledWithOrder.find((i, index) => i < nthCalledWithOrder[index + 1]);

							return context.report({
								node: getNextNode(node, nodeIndexToReport),
								fix(fixer) {
									const fixes = [];
									for (let i = 0; i < nthCalledWithOrder.length; i++) {
										const posInSortedArray = nthCalledWithOrderSorted.indexOf(nthCalledWithOrder[i]);
										const tmpCurNode = getNextNode(node, i);
										const nodeText = context.sourceCode.getText(tmpCurNode);
										const nodeToReplace = getNextNode(node, posInSortedArray);
										fixes.push(fixer.remove(tmpCurNode), fixer.insertTextAfter(nodeToReplace, nodeText));
									}
									return fixes;
								},
								...getErrorMessageObject(context.options, messages.outOfOrderNthCalledWith),
							});
						}
					}
				}

				if (nodeName === toHaveBeenCalledTimes) {
					if (previousNode && [toHaveBeenCalledWith].includes(getNodePropertyName(nextNode))) {
						return context.report({
							node,
							...getErrorMessageObject(options, messages.toHaveBeenCalledWithNotBefore),
							fix(fixer) {
								return swapLines(fixer, context, node, nextNode);
							},
						});
					}

					if (previousNode && [toHaveBeenNthCalledWith].includes(getNodePropertyName(nextNode))) {
						return context.report({
							node,
							...getErrorMessageObject(options, messages.toHaveBeenNthCalledWithNotBefore),
							fix(fixer) {
								return getFixesForLastCalledWithAtEnd(fixer, context, node, nextNode)
							},
						});
					}

					if (!previousNode) {
						if (getNodePropertyName(nextNode) === toHaveBeenCalledWith) {
							return context.report({
								node,
								...getErrorMessageObject(options, messages.toHaveBeenCalledWithNotBefore),
								fix(fixer) {
									return swapLines(fixer, context, node, nextNode);
								},
							});
						} else if (
							!nextNode ||
							(getNodePropertyName(nextNode) !== toHaveBeenCalledWith &&
								getNodePropertyName(nextNode) !== toHaveBeenNthCalledWith)
						) {
							return context.report({
								node,
								...getErrorMessageObject(options, messages.toHaveBeenCalledWithNotBefore),
							});
						}

						if (getNodePropertyName(nextNode) === toHaveBeenNthCalledWith) {
							return context.report({
								node,
								...getErrorMessageObject(options, messages.toHaveBeenNthCalledWithNotBefore),
								fix(fixer) {
									// todo does this actually do anything?, may be caught by other branches of logic now
									let fixes = []
									// we need to find the last toHaveBeenNthCalledWith
									let foundLastNthCalledWith = false
									let tmpNode = nextNode
									while(!foundLastNthCalledWith) {
										const tmpNextNode = getNextNode(tmpNode)
										const nextNodePropertyName = getNodePropertyName(tmpNextNode)

										if (nextNodePropertyName !== toHaveBeenNthCalledWith) {
											foundLastNthCalledWith = true
										} else {
											tmpNode = tmpNextNode
										}
									}

									const nodeText = context.sourceCode.getText(node);
									const tmpNodeText = context.sourceCode.getText(tmpNode);

									fixes.push(fixer.remove(node), fixer.insertTextAfter(node, tmpNodeText));
									fixes.push(fixer.remove(tmpNode), fixer.insertTextAfter(tmpNode, nodeText));

									return fixes
								},
							});
						} else if (
							!nextNode ||
							(getNodePropertyName(nextNode) !== toHaveBeenCalledWith &&
								getNodePropertyName(nextNode) !== toHaveBeenNthCalledWith)
						) {
							return context.report({
								node,
								...getErrorMessageObject(options, messages.toHaveBeenNthCalledWithNotBefore),
							});
						}
					} else {
						// determine if the arg matches between the two matchers
						if (getArgsOfExpectCall(node) !== getArgsOfExpectCall(previousNode)) {
							return context.report({
								node,
								...getErrorMessageObject(options, messages.identifiersAreNotMatching),
							});
						}

						const isMissingExpectedToHaveBeenCalledWith = (nodeToProcess: Rule.Node, propertyName: string) => {
							const numberOfTimesCalled = getNumberOfTimesCalled(nodeToProcess);
							return new Array(parseInt(numberOfTimesCalled, 10))
								.fill(null)
								.map((_i, index) => getPreviousNode(nodeToProcess, index + 1))
								.some((curNode) => curNode === null || getNodePropertyName(curNode) !== propertyName);
						}

						if (options?.toHaveBeenCalledWith?.strictNumberOfCalledWithMatchesCalledTimes) {
							if (isMissingExpectedToHaveBeenCalledWith(node, toHaveBeenCalledWith)) {
								return context.report({
									node,
									...getErrorMessageObject(options, messages.missingExpectedToHaveBeenCalledWith),
								});
							}
						}

						if (options?.toHaveBeenNthCalledWith?.strictNumberOfCalledWithMatchesCalledTimes) {
							if (isMissingExpectedToHaveBeenCalledWith(node, toHaveBeenNthCalledWith)) {
								return context.report({
									node,
									...getErrorMessageObject(options, messages.notAllToHaveBeenNthCalledWithListed),
								});
							}
						}
					}
				}
			},
		};
	},
};
