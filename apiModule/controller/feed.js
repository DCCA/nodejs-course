const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const io = require('../socket');
// Import models
const Post = require('../models/post');
const User = require('../models/user');

// Controllers
exports.getPosts = async (req, res, next) => {
	const currentPage = req.query.page || 1;
	const perPage = 2;
	try {
		const totalItems = await Post.find().countDocuments();
		const posts = await Post.find()
			.populate('creator')
			.sort({ createdAt: -1 })
			.skip((currentPage - 1) * perPage)
			.limit(perPage);
		res.status(200).json({
			message: 'Fetched posts successfully',
			posts: posts,
			totalItems: totalItems,
		});
	} catch (err) {
		err.statusCode = 500;
		next(err);
	}
};

exports.createPost = async (req, res, next) => {
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
	// Try
	try {
		await post.save();
		const user = await User.findById(req.userId);
		creator = user;
		user.posts.push(post);
		await user.save();
		io.getIO().emit('posts', {
			action: 'create',
			post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
		});
		res.status(201).json({
			message: 'Post created!',
			post: post,
			creator: { _id: creator._id, name: creator.name },
		});
	} catch (err) {
		err.statusCode = 500;
		next(err);
	}
};

exports.getPost = async (req, res, next) => {
	const postId = req.params.postId;
	// Try
	try {
		const post = await Post.findById(postId);
		if (!post) {
			const error = new Error('Could not find post');
			error.statusCode = 404;
			throw error;
		}
		res.status(200).json({ message: 'Post fetched', post: post });
		// Catch
	} catch (err) {
		err.statusCode = 500;
		next(err);
	}
};

exports.updatePost = async (req, res, next) => {
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
	try {
		const post = await (await Post.findById(postId)).populate('creator');
		if (!post) {
			const error = new Error('No post found');
			error.statusCode = 404;
			throw error;
		}
		if (post.creator._id.toString() !== req.userId) {
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
		const editedPost = await post.save();
		io.getIO().emit('posts', { action: 'update', post: editedPost });
		res.status(200).json({ message: 'Post updated', post: editedPost });
	} catch (err) {
		err.statusCode = 500;
		next(err);
	}
};

exports.deletePost = async (req, res, next) => {
	const postId = req.params.postId;
	try {
		const post = await Post.findById(postId);
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
		clearImage(post.imageUrl);
		await Post.findByIdAndRemove(postId);
		const user = await User.findById(req.userId);
		await user.posts.pull(postId);
		await user.save();
		io.getIO().emit('posts', { action: 'delete', post: postId });
		res.status(200).json({ message: 'Post deleted', post: post });
	} catch (err) {
		err.statusCode = 500;
		next(err);
	}
};

exports.getStatus = async (req, res, next) => {
	const userId = req.userId;
	try {
		const user = await User.findById(userId);
		if (!user) {
			const error = new Error('User not found');
			error.statusCode = 404;
			throw error;
		}
		const status = user.status;
		return res.status(200).json({ status: status });
	} catch (err) {
		err.statusCode = 500;
		next(err);
	}
};

exports.updateStatus = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		const error = new Error('Validation has failed. Data is incorrect.');
		error.statusCode = 422;
		throw error;
	}
	const userId = req.userId;
	const updatedStatus = req.body.status;
	try {
		const user = await User.findById(userId);
		if (!user) {
			const error = new Error('No user found');
			error.statusCode = 404;
			throw error;
		}
		user.status = updatedStatus;
		await user.save();
		res.status(200).json({ message: 'Status updated' });
	} catch (err) {
		err.statusCode = 500;
		next(err);
	}
};

// Helper function
const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, (err) => {
		console.log(err);
	});
};
