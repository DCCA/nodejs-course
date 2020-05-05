const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Import models
const Post = require('../models/post');
const User = require('../models/user');

// Controllers
exports.getPosts = (req, res, next) => {
	const currentPage = req.query.page || 1;
	const perPage = 2;
	let totalItems;
	Post.find()
		.countDocuments()
		.then((count) => {
			totalItems = count;
			return Post.find()
				.skip((currentPage - 1) * perPage)
				.limit(perPage);
		})
		.then((posts) => {
			res.status(200).json({
				message: 'Fetched posts successfully',
				posts: posts,
				totalItems: totalItems,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.createPost = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('Validation has failed. Data is incorrect.');
		error.status(422);
		throw error;
	}
	if (!req.file) {
		const error = new Error('No image provider');
		error.statusCode = 422;
		throw error;
	}
	const imageUrl = req.file.path;
	const title = req.body.title;
	const content = req.body.content;
	let creator;
	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
		creator: req.userId,
	});
	post
		.save()
		.then((result) => {
			console.log(result);
			return User.findById(req.userId);
		})
		.then((user) => {
			creator = user;
			user.posts.push(post);
			user.save();
		})
		.then((result) => {
			res.status(201).json({
				message: 'Post created!',
				post: post,
				creator: { _id: creator._id, name: creator.name },
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
	// Create post in db
};

exports.getPost = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error('Could not find post');
				error.statusCode = 404;
				throw error;
			}
			res.status(200).json({ message: 'Post fetched', post: post });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.updatePost = (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('Validation has failed. Data is incorrect.');
		error.statusCode = 422;
		throw error;
	}
	const postId = req.params.postId;
	const title = req.body.title;
	const content = req.body.content;
	let imageUrl = req.body.image;
	if (req.file) {
		imageUrl = req.file.path;
	}
	if (!imageUrl) {
		const error = new Error('No file picked');
		error.statusCode = 422;
		throw error;
	}
	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error('No post found');
				error.statusCode = 404;
				throw error;
			}
			if (post.creator.toString() !== req.userId) {
				const error = new Error('Not authorized');
				error.statusCode = 403;
				throw error;
			}
			if (imageUrl !== post.imageUrl) {
				clearImage(post.imageUrl);
			}
			post.title = title;
			post.content = content;
			post.imageUrl = imageUrl;
			return post.save();
		})
		.then((result) => {
			res.status(200).json({ message: 'Post updated', post: result });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.deletePost = (req, res, next) => {
	const postId = req.params.postId;
	console.log(postId);
	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error('No post found');
				error.statusCode = 404;
				throw error;
			}
			if (post.creator.toString() !== req.userId) {
				const error = new Error('Not authorized');
				error.statusCode = 403;
				throw error;
			}
			// checked log in user
			clearImage(post.imageUrl);
			return Post.findByIdAndRemove(postId);
		})
		.then((result) => {
			return User.findById(req.userId);
		})
		.then((user) => {
			user.posts.pull(postId);
			return user.save();
		})
		.then((result) => {
			console.log(result);
			return res.status(200).json({ message: 'Post deleted', post: result });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.getStatus = (req, res, next) => {
	const userId = req.userId;
	User.findById(userId)
		.then((user) => {
			if (!user) {
				const error = new Error('User not found');
				error.statusCode = 404;
				throw error;
			}
			const status = user.status;
			return res.status(200).json({ status: status });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.updateStatus = (req, res, next) => {
	console.log(req);
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('Validation has failed. Data is incorrect.');
		error.statusCode = 422;
		throw error;
	}
	const userId = req.userId;
	const updatedStatus = req.body.status;
	User.findById(userId)
		.then((user) => {
			if (!user) {
				const error = new Error('No user found');
				error.statusCode = 404;
				throw error;
			}
			user.status = updatedStatus;
			return user.save();
		})
		.then((result) => {
			console.log(result);
			res.status(200).json({ message: 'Status updated' });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

// Helper function
const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, (err) => {
		console.log(err);
	});
};
