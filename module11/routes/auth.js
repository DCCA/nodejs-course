const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
	'/login',
	// Validation block
	[
		body('email', 'Invalid e-mail').isEmail().normalizeEmail(),
		body('password', 'Invalid password')
			.isLength({ max: 5 })
			// .isAlphanumeric()
			.trim(),
	],
	authController.postLogin
);

router.post(
	'/signup',
	// Validation block
	[
		// Check the specific value of that name. This is the name in the HTML.
		check(
			'email',
			// Add a custom message
			'Please enter a valid e-mail'
		)
			// Validate if is email
			.isEmail()
			// How to create a custom validation in express-validator
			.custom((value, { req }) => {
				// if (value === 'test@test.com') {
				// 	throw new Error('This email address is forbidden');
				// }
				// return true;
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('E-mail already taken.');
					}
				});
			})
			.normalizeEmail(),
		body(
			'password',
			// Message for all validations
			'Please enter a password with only numbers and text and at least 5 characters'
		)
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(),
		body('confirmPassword')
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error("The passwords don't match ");
				}
				return true;
			})
			.trim(),
	],
	authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
