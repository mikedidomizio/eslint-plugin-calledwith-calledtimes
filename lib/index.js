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
		toHaveBeenCalledWith: require('./rules/toHaveBeenCalledWith'),
		toHaveBeenNthCalledWith: require('./rules/toHaveBeenNthCalledWith'),
	},
};
