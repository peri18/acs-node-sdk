var assert = require('assert'),
	testUtil = require('./testUtil'),
	ACSError = require('../lib/acsError'),
	messages = require('../lib/messages');

var acsEntryPoint = (process.env.ACS_ENTRYPOINT ? process.env.ACS_ENTRYPOINT : 'https://api.cloud.appcelerator.com');
var acsKey = process.env.ACS_APPKEY;
if (!acsKey) {
	console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
	process.exit(1);
}
console.log('ACS Entry Point: %s', acsEntryPoint);
console.log('MD5 of ACS_APPKEY: %s', testUtil.md5(acsKey));

var ACSApp = require('../index');

describe('Code Coverage Test', function() {
	describe('.acsError', function() {
		it('Should throw a general ACS error', function(done) {
			try {
				throw new ACSError();
			} catch (e) {
				assert(e);
				assert.equal(e.errorCode, 0);
				assert.equal(e.docUrl, null);
				assert.equal(e.message, 'ACS Node SDK Error');
			}
			done();
		});

		it('Should throw an ACS error with error message', function(done) {
			try {
				throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
					parameter: 'test missing field'
				});
			} catch (e) {
				assert.equal(e.errorCode, 1001);
				assert.equal(e.message, 'Required parameter test missing field is missing.');
			}
			done();
		});
	});

	describe('.acsApp', function() {
		it('Should list ACS objects correctly', function(done) {
			var acsObjects = ACSApp.getACSObjects();
			assert(acsObjects);
			assert(acsObjects.ACLs);
			assert(acsObjects.Chats);
			assert(acsObjects.Checkins);
			assert(acsObjects.Clients);
			assert(acsObjects.CustomObjects);
			assert(acsObjects.Emails);
			assert(acsObjects.Events);
			assert(acsObjects.Files);
			assert(acsObjects.Friends);
			assert(acsObjects.KeyValues);
			assert(acsObjects.Likes);
			assert(acsObjects.Logs);
			assert(acsObjects.Messages);
			assert(acsObjects.PhotoCollections);
			assert(acsObjects.Photos);
			assert(acsObjects.Places);
			assert(acsObjects.Posts);
			assert(acsObjects.PushNotifications);
			assert(acsObjects.PushSchedules);
			assert(acsObjects.Reviews);
			assert(acsObjects.SocialIntegrations);
			assert(acsObjects.Statuses);
			assert(acsObjects.Users);
			done();
		});

		it('Should not create ACSApp instance if parameters are wrong', function(done) {
			var testACSApp = null;
			try {
				testACSApp = require('../index')();
			} catch (e) {
				assert(e);
				assert.equal(e.errorCode, 1001);
			}
			try {
				testACSApp = require('../index')(true);
			} catch (e) {
				assert(e);
				assert.equal(e.errorCode, 1002);
			}
			try {
				testACSApp = require('../index')('ACSKey', 'wrong_parameter');
			} catch (e) {
				assert(e);
				assert.equal(e.errorCode, 1002);
			}
			done();
		});

		it('Should create ACSApp with customized entry point successfully', function(done) {
			var acsKey = 'ACSKey';
			var testEntryPoint = 'https://api-test.cloud.appcelerator.com';
			var testACSApp = new ACSApp(acsKey, {
				apiEntryPoint: testEntryPoint
			});
			assert(testACSApp);
			assert.equal(testACSApp.appKey, acsKey);
			assert(testACSApp.appOptions);
			assert.equal(testACSApp.appOptions.apiEntryPoint, testEntryPoint);
			done();
		});

		it('Should create ACSApp with default entry point successfully', function(done) {
			var acsKey = 'ACSKey';
			var defaultEntryPoint = 'https://api.cloud.appcelerator.com';
			var testACSApp = new ACSApp(acsKey, {});
			assert(testACSApp);
			assert.equal(testACSApp.appKey, acsKey);
			assert(testACSApp.appOptions);
			assert.equal(testACSApp.appOptions.apiEntryPoint, defaultEntryPoint);
			done();
		});
	});
});
