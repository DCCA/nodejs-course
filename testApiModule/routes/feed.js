const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { check, body } = require('express-validator');
// Controller
const feedController = require('../controller/feed');

router.get('/posts', isAuth, feedController.getPosts);

router.post(
	'/posts',
	isAuth,
	[
		body('title').trim().notEmpty().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.createPost
);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put(
	'/post/:postId',
	isAuth,
	[
		body('title').trim().notEmpty().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.updatePost
);

router.get('/status', isAuth, feedController.getStatus);

router.put(
	'/status/update',
	isAuth,
	[body('status').notEmpty().isLength({ min: 5 })],
	feedController.updateStatus
);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
