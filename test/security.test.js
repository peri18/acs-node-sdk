var assert = require('assert'),
	ACSNode = require('../index'),
	request = require('request-ssl');

describe('Security Test', function() {
	this.timeout(10000);

	var fingerprintRegex = /^SHA1\sFingerprint=(.*)/;

	it('should validate DEFAULT_API_ENTRY_POINT',function(done){
		if (process.env.TRAVIS) {
			assert.equal(process.env.FINGERPRINT_DEFAULT.replace(fingerprintRegex,'$1'), ACSNode.DEFAULT_API_ENTRY_POINT_FINGERPRINT);
			done();
		} else {
			request.getFingerprintForURL(ACSNode.DEFAULT_API_ENTRY_POINT, function(err,fingerprint){
				assert.ifError(err);
				assert.equal(fingerprint, ACSNode.DEFAULT_API_ENTRY_POINT_FINGERPRINT);
				done();
			});
		}
	});

	it('should validate DEFAULT_API_TEST_ENTRY_POINT',function(done){
		if (process.env.TRAVIS) {
			assert.equal(process.env.FINGERPRINT_TEST.replace(fingerprintRegex,'$1'), ACSNode.DEFAULT_API_TEST_ENTRY_POINT_FINGERPRINT);
			done();
		} else {
			request.getFingerprintForURL(ACSNode.DEFAULT_API_TEST_ENTRY_POINT, function(err,fingerprint){
				assert.ifError(err);
				assert.equal(fingerprint, ACSNode.DEFAULT_API_TEST_ENTRY_POINT_FINGERPRINT);
				done();
			});
		}
	});

});