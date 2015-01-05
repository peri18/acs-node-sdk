/**
 * ACS specific error class.
 *
 * @module acsError
 *
 * @copyright
 * Copyright (c) 2012-2014 by Appcelerator, Inc. All Rights Reserved.
 *
 * @license
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const
	util = require('util'),
	_ = require('lodash'),

	ACS_ERROR_NAME = 'ACS Node SDK Error';

/*
 * Public APIs
 */
module.exports = ACSError;

/**
 * Creates a ACS error object.
 *
 * @class
 * @classdesc ACS error class.
 * @constructor
 * @extends Error
 *
 * @param {object} errorEntry - The error message object from the `messages` module.
 * @param {object} parameters - Params that are injected into placeholders in the error message.
 */
function ACSError(errorEntry, parameters) {
	Error.captureStackTrace(this);

	errorEntry || (errorEntry = {});
	parameters || (parameters || {});

	this.errorCode = errorEntry.errorCode || 0;
	this.docUrl = errorEntry.docUrl || null;
	this.message = _.clone(errorEntry.message || ACS_ERROR_NAME);
	for (var parameter in parameters) {
		this.message = this.message.replace('%' + parameter + '%', parameters[parameter]);
		this[parameter] || (this[parameter] = parameters[parameter]);
	}
}

util.inherits(ACSError, Error);

ACSError.prototype.name = ACS_ERROR_NAME;
