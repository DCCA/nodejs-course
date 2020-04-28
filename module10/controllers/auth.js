const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.session.isLoggedIn,
	});
};

exports.postLogin = (req, res, next) => {
	User.findById('5ea7453b923fe8a922fc649a')
		.then((user) => {
			req.session.user = user;
			req.session.isLoggedIn = true;
			// To wait the session save
			req.session.save((err) => {
				return res.redirect('/');
			});
		})
		.catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
	// Clear the session
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
