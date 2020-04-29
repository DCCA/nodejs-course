const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const SENDGRID_CREDENTIALS = require('../util/api-keys').SENDGRID_CREDENTIALS;
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

// Initializer and configuration
const transporter = nodemailer.createTransport(
	sendgridTransport(SENDGRID_CREDENTIALS)
);

exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: message,
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: message,
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'Invalid e-mail or password.');
				return res.redirect('/login');
			}
			bcrypt
				// Check password
				.compare(password, user.password)
				.then((doMatch) => {
					// If passwords match, do the login
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							console.log(err);
							res.redirect('/');
						});
					}
					// If not, redirect the user
					req.flash('error', 'Invalid e-mail or password.');
					return res.redirect('/login');
				})
				.catch((err) => {
					console.log(err);
					req.flash('error', 'Invalid e-mail or password.');
					return res.redirect('/login');
				});
		})
		.catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// console.log(errors.array());
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
		});
	}
	bcrypt
		.hash(password, 12)
		.then((hashedPassword) => {
			const user = new User({
				email: email,
				password: hashedPassword,
				cart: { items: [] },
			});
			return user.save();
		})
		.then((result) => {
			res.redirect('/login');
			return transporter
				.sendMail({
					to: email,
					from: 'dcca12@gmail.com',
					subject: 'Sign up succeeded',
					html: '<h1>You successfully signed up!</h1>',
				})
				.then((result) => {
					console.log(result);
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};

exports.getReset = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: 'Reset',
		errorMessage: message,
	});
};

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then((user) => {
				let message = req.flash('error');
				if (!user) {
					req.flash('error', 'No account with that e-mail');
					return res.redirect('/reset');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				return user.save();
			})
			.then((result) => {
				res.redirect('/');
				transporter
					.sendMail({
						to: req.body.email,
						from: 'dcca12@gmail.com',
						subject: 'Password reset',
						html: `
						<p>You requested a password reset</p>
						<p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
					`,
					})
					.then((result) => {
						console.log(result);
					})
					.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err));
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then((user) => {
			let message = req.flash('error');
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: 'New Password',
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const userId = req.body.userId;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId,
	})
		.then((user) => {
			resetUser = user;
			return bcrypt.hash(newPassword, 12);
		})
		.then((hashedPassword) => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = null;
			resetUser.resetTokenExpiration = undefined;
			return resetUser.save();
		})
		.then((result) => {
			res.redirect('/login');
		})
		.catch((err) => console.log(err));
};
