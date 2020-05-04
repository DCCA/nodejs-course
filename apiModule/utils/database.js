const mongoose = require('mongoose');

// Middle wares
exports.dbConnection = mongoose
	.connect(
		'mongodb+srv://root:12Guitar@node-complete-bftj6.gcp.mongodb.net/messages?retryWrites=true&w=majority'
	)
	.then((result) => {
		return result;
	})
	.catch((err) => {
		return err;
	});
