/**
 * Appcelerator Cloud Services (ACS) application object.
 *
 * @module acs
 *
 * @copyright
 * Copyright (c) 2012-2014 by Appcelerator, Inc. All Rights Reserved.
 *
 * @license
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const
	ACSError = require('./acsError'),
	apis = require('./apis'),
	messages = require('./messages'),

	DEFAULT_API_ENTRY_POINT = 'https://api.cloud.appcelerator.com',

	// Default appOptions
	DEFAULT_APP_OPTIONS = {
		apiEntryPoint: DEFAULT_API_ENTRY_POINT
	};

/*
 * Public APIs
 */
module.exports = ACSApp;

/**
 * Creates a object to expose an ACS session. Each object maintains its own
 * state. For example, two different ACSApp instances may be logged in as
 * different users.
 *
 * @class
 * @classdesc Main class to instantiate ACS Node SDK object for user to use.
 * @constructor
 *
 * @example
 *   var ACSApp = require('acs-node');
 *   var acsApp = new ACSApp('ACS_APP_KEY');
 *
 *   acsApp.usersLogin({
 *       login: ACS_USERNAME,
 *       password: ACS_PASSWORD
 *   }, function(err, result) {
 *       if (err) {
 *           console.error(err);
 *           return;
 *       }
 *       console.log('Logged in user: %j', result.body);
 *       acsApp.usersShowMe(function(err, result) {
 *           if (err) {
 *               console.error(err);
 *               return;
 *           }
 *           console.log('Show user: %j', result.body);
 *       });
 *   });
 *
 * @param {string} acsAppKey - The ACS key to be used for API calls.
 * @param {object} [appOptions] - An object containing various options.
 * @param {string} [appOptions.apiEntryPoint] - The URL to use for all requests.
 * @param {boolean} [appOptions.prettyJson] - When truthy, sets the `pretty_json` REST option.
 */
function ACSApp(acsAppKey, appOptions) {
	if (!acsAppKey) {
		throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			parameter: 'ACS app key'
		});
	}

	if (typeof acsAppKey !== 'string') {
		throw new ACSError(messages.ERR_WRONG_TYPE, {
			typeName: 'ACS app key'
		});
	}

	this.appKey = acsAppKey;

	if (!appOptions) {
		this.appOptions = DEFAULT_APP_OPTIONS;
	} else if (typeof appOptions !== 'object') {
		throw new ACSError(messages.ERR_WRONG_TYPE, {
			typeName: 'ACS app options'
		});
	} else if (!appOptions.apiEntryPoint) {
		if (appOptions.apiEntryPoint && typeof appOptions.apiEntryPoint !== 'string') {
			throw new ACSError(messages.ERR_WRONG_TYPE, {
				typeName: 'ACS app options api entry point'
			});
		}
		this.appOptions = appOptions;
		this.appOptions.apiEntryPoint = DEFAULT_API_ENTRY_POINT;
	} else {
		this.appOptions = appOptions;
	}

	this.sessionCookieString = null;
}

ACSApp.prototype = Object.create(apis);

/**
 * Return an object map of all ACS Object descriptors.
 *
 * @returns {object} A map of all ACS objects descriptors.
 */
ACSApp.getACSObjects = ACSApp.prototype.getACSObjects;
