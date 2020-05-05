const mongoose = require('mongoose');

exports.dbConnection = mongoose
	.connect(
		'mongodb+srv://root:<password>@node-complete-bftj6.gcp.mongodb.net/messages?retryWrites=true&w=majority',
		{ useNewUrlParser: true }
	)
	.then((result) => {
		console.log('End');
		return result;
	})
	.catch((err) => {
		return err;
	});
