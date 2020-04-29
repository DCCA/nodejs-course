const mongoose = require('mongoose');

const dbConnection = mongoose
	.connect(
		'mongodb+srv://root:<password>@node-complete-bftj6.gcp.mongodb.net/test?retryWrites=true&w=majority'
	)
	.then((result) => {
		//console.log(result);
	})
	.catch((err) => {
		throw err;
	});

module.exports = dbConnection;
