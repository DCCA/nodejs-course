const expect = require('chai').expect;
const sinon = require('sinon');
const testDbConnection = require('../utils/database').testDbConnection;
const mongoose = require('mongoose');
const User = require('../models/user');
const AuthController = require('../controller/auth');
const FeedController = require('../controller/feed');

describe('Auth Controller - Login', function () {
	before(function (done) {
		testDbConnection
			.then((result) => {
				console.log('DB Connected');
				const user = new User({
					name: 'Daniel',
					email: 'test@test.com',
					password: 'test',
					posts: [],
					_id: '5c0f66b979af55031b34728a',
				});
				return user.save();
			})
			.then(() => {
				console.log('Created user');
				done();
			});
	});
	// pass "done" for testing async
	it('should throw an error with code 500 if database connection failed', function (done) {
		sinon.stub(User, 'findOne');
		User.findOne.throws();

		const req = {
			body: {
				email: 'test@gmail.com',
				password: 'test',
			},
		};

		AuthController.login(req, {}, () => {}).then((result) => {
			expect(result).to.be.an('error');
			expect(result).to.have.property('statusCode', 500);
			done();
		});

		User.findOne.restore();
	});

	// it('should send a response with a valid user status for a existing user', function (done) {
	// 	console.log('Create vars');
	// 	const req = {
	// 		userId: '5c0f66b979af55031b34728a',
	// 	};
	// 	const res = {
	// 		statusCode: 500,
	// 		userStatus: null,
	// 		status: function (code) {
	// 			this.statusCode = code;
	// 			return this;
	// 		},
	// 		json: function (data) {
	// 			this.userStatus = data.status;
	// 		},
	// 	};
	// 	console.log('Start getStatus');
	// 	FeedController.getStatus(req, res, () => {}).then(() => {
	// 		expect(res.statusCode).to.be.equal(200);
	// 		expect(user.status).to.be.equal('I am new!');
	// 		done();
	// 	});
	// 	console.log('End getStatus');
	// });
	// after(function (done) {
	// 	User.deleteMany({})
	// 		.then(() => {
	// 			return mongoose.disconnect();
	// 		})
	// 		.then(() => {
	// 			done();
	// 		});
	// });
});
