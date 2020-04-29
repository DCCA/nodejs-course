const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const SENDGRID_CREDENTIALS = require('../util/api-keys').SENDGRID_CREDENTIALS;

const User = require('../models/user');

// Initializer and configuration
const transporter = nodemailer.createTransport(
	sendgridTransport({ SENDGRID_CREDENTIALS })
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
	const confirmedPassword = req.body.confirmedPassword;
	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				req.flash('error', 'E-mail already taken.');
				return res.redirect('/signup');
			}
			return bcrypt.hash(password, 12).then((hashedPassword) => {
				const user = new User({
					email: email,
					password: hashedPassword,
					cart: { items: [] },
				});
				return user.save();
			});
		})
		.then((result) => {
			res.redirect('/login');
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
