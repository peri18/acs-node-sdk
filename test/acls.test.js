var ACSNode = require('../index'),
	assert = require('assert'),
	testUtil = require('./testUtil');

var acsEntryPoint = (process.env.ACS_ENTRYPOINT ? process.env.ACS_ENTRYPOINT : 'https://api.cloud.appcelerator.com');
var acsKey = process.env.ACS_APPKEY;
if (!acsKey) {
	console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
	process.exit(1);
}
console.log('ACS Entry Point: %s', acsEntryPoint);
console.log('MD5 of ACS_APPKEY: %s', testUtil.md5(acsKey));

var acsUsername = null,
	acsPassword = 'cocoafish',

	acsReaderUsername,
	acsReaderUserId,

	acsWriterUsername,
	acsWriterUserId,

	acsACLName = 'aclTest',
	acsACLsCount = 0;


describe('ACLs Test', function() {
	before(function(done) {
		this.acsAppGeneral = new ACSNode(acsKey, {
			apiEntryPoint: acsEntryPoint,
			prettyJson: true
		});

		this.acsAppReader = new ACSNode(acsKey, {
			apiEntryPoint: acsEntryPoint,
			prettyJson: true
		});

		this.acsAppWriter = new ACSNode(acsKey, {
			apiEntryPoint: acsEntryPoint,
			prettyJson: true
		});

		testUtil.generateUsername(function(username) {
			acsUsername = username;
			acsReaderUsername = acsUsername + '_reader';
			acsWriterUsername = acsUsername + '_writer';
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	describe('.createUser', function() {
		it('Should create user as ACL reader successfully', function(done) {
			this.timeout(20000);
			this.acsAppReader.usersCreate({
				username: acsReaderUsername,
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
				assert.equal(result.body.response.users[0].username, acsReaderUsername);
				assert(result.body.response.users[0].id);
				acsReaderUserId = result.body.response.users[0].id;

				this.acsAppReader.usersLogin({
					login: acsReaderUsername,
					password: acsPassword
				}, function (err, result) {
					assert.ifError(err);
					assert(result);
					done();
				});
			}.bind(this));
		});

		it('Should create user as ACL writer successfully', function(done) {
			this.timeout(20000);
			this.acsAppWriter.usersCreate({
				username: acsWriterUsername,
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
				assert.equal(result.body.response.users[0].username, acsWriterUsername);
				assert(result.body.response.users[0].id);
				acsWriterUserId = result.body.response.users[0].id;

				this.acsAppWriter.usersLogin({
					login: acsWriterUsername,
					password: acsPassword
				}, function (err, result) {
					assert.ifError(err);
					assert(result);
					done();
				});
			}.bind(this));
		});

		it('Should create general user successfully', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.usersCreate({
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

				this.acsAppGeneral.usersLogin({
					login: acsUsername,
					password: acsPassword
				}, function (err, result) {
					assert.ifError(err);
					assert(result);
					done();
				});
			}.bind(this));
		});
	});

	describe('.queryAndCountACLs', function() {
		it('Should return all ACLs', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsQuery({
				limit: 100
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryACL');
				assert(result.body.response);
				assert(result.body.response.acls);
				acsACLsCount = result.body.response.acls.length;
				assert.equal(typeof acsACLsCount, 'number');
				done();
			});
		});

		it('Should return the correct ACL number as queried before', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'aclsCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent acls count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsACLsCount);
				done();
			});
		});
	});

	describe('.addACL', function() {
		it('Should add ACL successfully', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsAddUser({
				name: acsACLName,
				reader_ids: acsReaderUserId,
				writer_ids: acsWriterUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createAcl');
				assert(result.body.response);
				assert(result.body.response.acls);
				assert(result.body.response.acls[0]);
				assert.equal(result.body.response.acls[0].name, acsACLName);
				done();
			});
		});

		it('ACLs count should be increased', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'aclsCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				assert.equal(typeof result.body.meta.count, 'number');
				console.log('\tCurrent acls count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsACLsCount + 1);
				done();
			});
		});

		it('Should query ACL correctly', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsQuery({
				where: {
					name: acsACLName
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryACL');
				assert(result.body.response);
				assert(result.body.response.acls);
				assert(result.body.response.acls[0]);
				assert.equal(result.body.response.acls[0].name, acsACLName);
				done();
			});
		});
	});

	describe('.checkACL', function() {
		it('Should check ACL successfully', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsCheckUser({
				name: acsACLName,
				user_id: acsWriterUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'checkAcl');
				assert(result.body.response);
				assert(result.body.response.permission);
				assert.equal(result.body.response.permission.read_permission, false);
				assert.equal(result.body.response.permission.write_permission, true);
				done();
			});
		});
	});

	describe('.removeACL', function() {
		it('Should check ACL successfully', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsRemove({
				name: acsACLName
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteAcl');
				done();
			});
		});
	});

	describe('.deleteUser', function() {
		it('Should delete current user successfully', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.usersRemove(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteUser');
				done();
			});
		});

		it('Should delete reader successfully', function(done) {
			this.timeout(20000);
			this.acsAppReader.usersRemove(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteUser');
				done();
			});
		});

		it('Should delete writer successfully', function(done) {
			this.timeout(20000);
			this.acsAppWriter.usersRemove(function(err, result) {
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
