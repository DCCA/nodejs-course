const authMiddleware = require('../middleware/is-auth');
const jwt = require('jsonwebtoken');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Auth Middleware', function () {
	it('Should throw error if no auth header is not present', function () {
		const req = {
			get: function (headerName) {
				return null;
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
			'Not authenticated'
		);
	});

	it('should throw an error if the auth header is only one string', function () {
		const req = {
			get: function (headerName) {
				return 'xyz';
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});

	it('should yield a UserID after decoding the token', function () {
		const req = {
			get: function (headerName) {
				return 'Bearer xyz';
			},
		};
		sinon.stub(jwt, 'verify');
		jwt.verify.returns({ userId: 'abc' });
		authMiddleware(req, {}, () => {});
		expect(req).to.have.property('userId');
		expect(req).to.have.property('userId', 'abc');
		jwt.verify.restore();
	});

	it('should throw an error if the token cannot be verified', function () {
		const req = {
			get: function (headerName) {
				return 'Bearer xyz';
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});
});
