const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();

const authController = require('../controller/auth');

router.put(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Invalid e-mail')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('Email already taken');
					}
				});
			})
			.normalizeEmail(),
		body('password').trim().isLength({ min: 5 }),
		body('name').trim().isEmpty(),
	],
	authController.signup
);

router.post('/login', authController.login);

module.exports = router;
