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

	acsReaderUsername1,
	acsReaderUserId1,

	acsReaderUsername2,
	acsReaderUserId2,

	acsWriterUsername1,
	acsWriterUserId1,

	acsWriterUsername2,
	acsWriterUserId2,

	acsACLName = 'aclTest',
	acsACLsCount = 0;


describe('ACLs Test', function() {
	before(function(done) {
		this.acsAppGeneral = new ACSNode(acsKey, {
			apiEntryPoint: acsEntryPoint,
			prettyJson: true
		});

		this.acsAppReader1 = new ACSNode(acsKey, {
			apiEntryPoint: acsEntryPoint,
			prettyJson: true
		});

		this.acsAppReader2 = new ACSNode(acsKey, {
			apiEntryPoint: acsEntryPoint,
			prettyJson: true
		});

		this.acsAppWriter1 = new ACSNode(acsKey, {
			apiEntryPoint: acsEntryPoint,
			prettyJson: true
		});

		this.acsAppWriter2 = new ACSNode(acsKey, {
			apiEntryPoint: acsEntryPoint,
			prettyJson: true
		});

		testUtil.generateUsername(function(username) {
			acsUsername = username;
			acsReaderUsername1 = acsUsername + '_reader_1';
			acsReaderUsername2 = acsUsername + '_reader_2';
			acsWriterUsername1 = acsUsername + '_writer_1';
			acsWriterUsername2 = acsUsername + '_writer_2';
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	describe('.createUser', function() {
		it('Should create user as ACL reader 1 successfully', function(done) {
			this.timeout(20000);
			this.acsAppReader1.usersCreate({
				username: acsReaderUsername1,
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
				assert.equal(result.body.response.users[0].username, acsReaderUsername1);
				assert(result.body.response.users[0].id);
				acsReaderUserId1 = result.body.response.users[0].id;

				this.acsAppReader1.usersLogin({
					login: acsReaderUsername1,
					password: acsPassword
				}, function(err, result) {
					assert.ifError(err);
					assert(result);
					done();
				});
			}.bind(this));
		});

		it('Should create user as ACL reader 2 successfully', function(done) {
			this.timeout(20000);
			this.acsAppReader2.usersCreate({
				username: acsReaderUsername2,
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
				assert.equal(result.body.response.users[0].username, acsReaderUsername2);
				assert(result.body.response.users[0].id);
				acsReaderUserId2 = result.body.response.users[0].id;

				this.acsAppReader2.usersLogin({
					login: acsReaderUsername2,
					password: acsPassword
				}, function(err, result) {
					assert.ifError(err);
					assert(result);
					done();
				});
			}.bind(this));
		});

		it('Should create user as ACL writer 1 successfully', function(done) {
			this.timeout(20000);
			this.acsAppWriter1.usersCreate({
				username: acsWriterUsername1,
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
				assert.equal(result.body.response.users[0].username, acsWriterUsername1);
				assert(result.body.response.users[0].id);
				acsWriterUserId1 = result.body.response.users[0].id;

				this.acsAppWriter1.usersLogin({
					login: acsWriterUsername1,
					password: acsPassword
				}, function(err, result) {
					assert.ifError(err);
					assert(result);
					done();
				});
			}.bind(this));
		});

		it('Should create user as ACL writer 2 successfully', function(done) {
			this.timeout(20000);
			this.acsAppWriter2.usersCreate({
				username: acsWriterUsername2,
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
				assert.equal(result.body.response.users[0].username, acsWriterUsername2);
				assert(result.body.response.users[0].id);
				acsWriterUserId2 = result.body.response.users[0].id;

				this.acsAppWriter2.usersLogin({
					login: acsWriterUsername2,
					password: acsPassword
				}, function(err, result) {
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
				}, function(err, result) {
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

	describe('.createACL', function() {
		it('Should create ACL successfully', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsCreate({
				name: acsACLName,
				reader_ids: acsReaderUserId1,
				writer_ids: acsWriterUserId1
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
				user_id: acsWriterUserId1
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

	describe('.addRemoveACLUser', function() {
		it('Should query ACL correctly without acsReaderUser2 and acsWriterUser2', function(done) {
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
				assert(result.body.response.acls[0].readers);
				assert(result.body.response.acls[0].readers.indexOf(acsReaderUserId2) === -1);
				assert(result.body.response.acls[0].writers);
				assert(result.body.response.acls[0].writers.indexOf(acsWriterUserId2) === -1);
				done();
			});
		});

		it('Should add acsReaderUser2 and acsWriterUser2 into ACL successfully', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsAddUser({
				name: acsACLName,
				reader_ids: acsReaderUserId2,
				writer_ids: acsWriterUserId2
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'addAcl');
				done();
			});
		});

		it('Should query ACL correctly with acsReaderUser2 and acsWriterUser2', function(done) {
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
				assert(result.body.response.acls[0].readers);
				assert(result.body.response.acls[0].readers.indexOf(acsReaderUserId2) !== -1);
				assert(result.body.response.acls[0].writers);
				assert(result.body.response.acls[0].writers.indexOf(acsWriterUserId2) !== -1);
				done();
			});
		});

		it('Should remove acsReaderUser2 and acsWriterUser2 from ACL successfully', function(done) {
			this.timeout(20000);
			this.acsAppGeneral.aclsRemoveUser({
				name: acsACLName,
				reader_ids: acsReaderUserId2,
				writer_ids: acsWriterUserId2
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'removeAcl');
				done();
			});
		});

		it('Should query ACL correctly without acsReaderUser2 and acsWriterUser2', function(done) {
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
				assert(result.body.response.acls[0].readers);
				assert(result.body.response.acls[0].readers.indexOf(acsReaderUserId2) === -1);
				assert(result.body.response.acls[0].writers);
				assert(result.body.response.acls[0].writers.indexOf(acsWriterUserId2) === -1);
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

		it('Should delete reader 1 successfully', function(done) {
			this.timeout(20000);
			this.acsAppReader1.usersRemove(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteUser');
				done();
			});
		});

		it('Should delete reader 2 successfully', function(done) {
			this.timeout(20000);
			this.acsAppReader2.usersRemove(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteUser');
				done();
			});
		});

		it('Should delete writer 1 successfully', function(done) {
			this.timeout(20000);
			this.acsAppWriter1.usersRemove(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteUser');
				done();
			});
		});

		it('Should delete writer 2 successfully', function(done) {
			this.timeout(20000);
			this.acsAppWriter2.usersRemove(function(err, result) {
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
