/**
 * Loads all ACS Object APIs and their REST descriptors from the 'acsObjects'
 * directory.
 *
 * @module apis
 *
 * @copyright
 * Copyright (c) 2012-2014 by Appcelerator, Inc. All Rights Reserved.
 *
 * @license
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const
	acsRest = require('./rest'),
	fs = require('fs'),
	path = require('path'),
	u = require('./util'),
	_ = require('lodash'),

	DOC_BASE_URL = 'http://docs.appcelerator.com/cloud/latest/#!/api/',

	// Suported HTTP method for direct rest call. User can use acsApp.post('/v1/users/login.json')
	HTTP_METHOD_LIST = ['get', 'post', 'put', 'delete'],

	apisDir = path.join(__dirname, 'acsObjects'),
	jsRegExp = /\.js$/;

var acsObjects = {},
	publicAPI = {};

/*
 * Public APIs
 */
module.exports = publicAPI;

// read javascript files one by one
fs.readdirSync(apisDir).forEach(function (filename) {
	if (jsRegExp.test(filename)) {
		_.merge(acsObjects, require(path.join(apisDir, filename)));
	}
});

// add doc url and method list into each ACS objects, then define each public api
Object.keys(acsObjects).forEach(function (acsObjectKey) {
	var acsObject = acsObjects[acsObjectKey],
		baseMethodName = u.lowercaseFirstChar(acsObject.objectName ? acsObject.objectName : acsObjectKey);

	acsObject.docUrl = DOC_BASE_URL + acsObjectKey;
	acsObject.fieldList = acsObject.fields;
	acsObject.methods || (acsObject.methods = {});
	acsObject.methodList = Object.keys(acsObject.methods);

	// construct the methods for each ACS object such as `usersLogin()` and `aclsQuery()`
	acsObject.methodList.forEach(function (acsObjectMethodKey) {
		var methodName = baseMethodName + u.capitalizeString(acsObjectMethodKey),
			acsObjectMethod = acsObject.methods[acsObjectMethodKey];

		publicAPI[methodName] = acsRest.createACSRequestFunction({
			acsObjectKey:              acsObjectKey,
			acsObjectName:             (acsObject.restObject || acsObjectMethod.restObject || acsObjectKey).toLowerCase(),
			acsObjectMethodKey:        acsObjectMethodKey,
			acsObjectMethodName:       acsObjectMethod.restMethod || acsObjectMethodKey,
			acsObjectMethodPreAction:  acsObjectMethod.preAction,
			acsObjectMethodPostAction: acsObjectMethod.postAction,
			httpMethod:                acsObjectMethod.httpMethod
		});
	});
});

// create methods for each supported HTTP method such as `acsApp.get()` and `acsApp.post()`
HTTP_METHOD_LIST.forEach(function (httpMethod) {
	publicAPI[httpMethod] = acsRest.createACSRESTRequestFunction(httpMethod.toUpperCase());
});

/**
 * Returns the full map of all ACS Object descriptors.
 */
publicAPI.getACSObjects = function getACSObjects() {
	return acsObjects;
};
