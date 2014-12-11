var assert = require('assert'),
	testUtil = require('./testUtil');

var acsEntryPoint = (process.env.ACS_ENTRYPOINT ? process.env.ACS_ENTRYPOINT : 'https://api.cloud.appcelerator.com');
var acsKey = process.env.ACS_APPKEY;
if (!acsKey) {
	console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
	process.exit(1);
}
console.log('ACS Entry Point: %s', acsEntryPoint);
console.log('MD5 of ACS_APPKEY: %s', testUtil.md5(acsKey));

var ACSApp = require('../index'),
	acsApp = new ACSApp(acsKey),
	acsAppFriend = new ACSApp(acsKey, {
		apiEntryPoint: acsEntryPoint,
		prettyJson: true
	}),
	acsUsername = null,
	acsUserId,
	acsPassword = 'cocoafish',
	acsFriendUsername,
	acsFriendUserId;

describe('Friends Test', function() {
	before(function(done) {
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			acsFriendUsername = acsUsername + '_friend';
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	describe('.createUser', function() {
		it('Should create user as friend successfully', function(done) {
			this.timeout(20000);
			acsAppFriend.usersCreate({
				username: acsFriendUsername,
				password: acsPassword,
				password_confirmation: acsPassword
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createUser');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].username, acsFriendUsername);
				assert(result.body.response.users[0].id);
				acsFriendUserId = result.body.response.users[0].id;

				acsAppFriend.usersLogin({
					login: acsFriendUsername,
					password: acsPassword
				}, function (err, result) {
					assert.ifError(err);
					assert(result);
					done();
				});
			});
		});

		it('Should create general user successfully', function(done) {
			this.timeout(20000);
			acsApp.usersCreate({
				username: acsUsername,
				password: acsPassword,
				password_confirmation: acsPassword
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createUser');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].username, acsUsername);
				assert(result.body.response.users[0].id);
				acsUserId = result.body.response.users[0].id;

				acsApp.usersLogin({
					login: acsUsername,
					password: acsPassword
				}, function (err, result) {
					assert.ifError(err);
					assert(result);
					done();
				});
			});
		});
	});

	describe('.createFriends', function() {
		it('Should create friend successfully', function(done) {
			this.timeout(20000);
			acsApp.friendsAdd({
				user_ids: acsFriendUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'addFriends');
				done();
			});
		});
	});

	describe('.viewAndApproveFriends', function() {
		it('Should show pending friend successfully', function(done) {
			this.timeout(20000);
			acsAppFriend.friendsRequests(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'friendRequests');
				assert(result.body.response);
				assert(result.body.response.friend_requests);
				assert(result.body.response.friend_requests[0]);
				assert.equal(result.body.response.friend_requests[0].user_id, acsUserId);
				assert(result.body.response.friend_requests[0].user);
				assert.equal(result.body.response.friend_requests[0].user.id, acsUserId);
				assert.equal(result.body.response.friend_requests[0].user.username, acsUsername);
				done();
			});
		});

		it('Should approve pending friend successfully', function(done) {
			this.timeout(20000);
			acsAppFriend.friendsApprove({
				user_ids: acsUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'approveFriends');
				done();
			});
		});

		it('Should return approved friend successfully', function(done) {
			this.timeout(20000);
			acsApp.friendsQuery({
				limit: 100
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryFriends');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].id, acsFriendUserId);
				assert.equal(result.body.response.users[0].username, acsFriendUsername);
				done();
			});
		});
	});

	describe('.searchFriends', function() {
		it('Should return search result successfully', function(done) {
			this.timeout(20000);
			acsApp.friendsSearch(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'searchFriends');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].id, acsFriendUserId);
				assert.equal(result.body.response.users[0].username, acsFriendUsername);
				done();
			});
		});
	});

	describe('.removeFriends', function() {
		it('Should remove friend successfully', function(done) {
			this.timeout(20000);
			acsApp.friendsRemove({
				user_ids: acsFriendUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'removeFriends');
				done();
			});
		});

		it('Should have deleted friend', function(done) {
			this.timeout(20000);
			acsApp.friendsQuery({
				limit: 100
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryFriends');
				assert(result.body.response);
				assert(!result.body.response.users);
				done();
			});
		});
	});

	describe('.deleteUser', function() {
		it('Should delete current user successfully', function(done) {
			this.timeout(20000);
			acsApp.usersRemove(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteUser');
				done();
			});
		});

		it('Should delete friend successfully', function(done) {
			this.timeout(20000);
			acsAppFriend.usersRemove(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteUser');
				done();
			});
		});
	});
});
