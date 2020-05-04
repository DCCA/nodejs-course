const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
// Controller
const feedController = require('../controller/feed');

router.get('/posts', feedController.getPosts);

router.post(
	'/posts',
	[
		body('title').trim().notEmpty().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.createPost
);

router.get('/post/:postId', feedController.getPost);

router.put(
	'/post/:postId',
	[
		body('title').trim().notEmpty().isLength({ min: 5 }),
		body('content').trim().isLength({ min: 5 }),
	],
	feedController.updatePost
);

module.exports = router;
