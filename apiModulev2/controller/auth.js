const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');

// exports.signup = async (req, res, next) => {
// 	const errors = validationResult(req);
// 	if (!errors.isEmpty) {
// 		const error = new Error('Validation failed');
// 		error.statusCode = 422;
// 		error.data = error.array();
// 		throw error;
// 	}
// 	const email = req.body.email;
// 	const name = req.body.name;
// 	const password = req.body.password;
// 	try {
// 		const hashedPassword = await bcrypt.hash(password, 12);
// 		const user = new User({
// 			email: email,
// 			password: hashedPassword,
// 			name: name,
// 		});
// 		const result = await user.save();
// 		res.status(201).json({
// 			message: 'User created',
// 			userId: result._id,
// 		});
// 	} catch (err) {
// 		err.statusCode = 500;
// 		next(err);
// 	}
// };

// exports.login = async (req, res, next) => {
// 	const email = req.body.email;
// 	const password = req.body.password;
// 	let loadedUser;
// 	try {
// 		const user = await User.findOne({ email: email });
// 		if (!user) {
// 			const error = new Error('User not found');
// 			error.statusCode = 404;
// 			throw error;
// 		}
// 		loadedUser = user;
// 		const isEqual = await bcrypt.compare(password, user.password);
// 		if (!isEqual) {
// 			const error = new Error('Wrong password');
// 			error.statusCode = 401;
// 			throw error;
// 		}
// 		const token = jwt.sign(
// 			{
// 				email: loadedUser.email,
// 				userId: loadedUser._id.toString(),
// 			},
// 			'secret',
// 			{ expiresIn: '1h' }
// 		);
// 		res.status(200).json({ token: token, userId: loadedUser._id.toString() });
// 	} catch (err) {
// 		err.statusCode = 500;
// 		next(err);
// 	}
// };
