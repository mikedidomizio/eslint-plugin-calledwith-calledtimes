/**
 * @fileoverview verify toHaveBeen(Nth)CalledWith used with toHaveBeenCalledTimes
 * @author Mike DiDomizio
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

module.exports = {
	rules: {
		jest: require('./rules/jest'),
		// toHaveBeenCalledWith: require('./rules/toHaveBeenCalledWith'),
		// toHaveBeenNthCalledWith: require('./rules/toHaveBeenNthCalledWith'),
	},
};
