const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const dbConnection = require('./utils/database').dbConnection;
const path = require('path');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');
// Create app
const app = express();

// App set up
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + ' - ' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(bodyParser.json());
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));
// Fix the CORS error and set headers
app.use((req, res, next) => {
	// Set domains
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Set the methods
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	//
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	// You have to set this to allow the server to connect to GraphQL Server
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

// Set auth in GraphQL
app.use(auth);
// Set GraphQL
app.use(
	'/graphql',
	graphqlHttp({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
		// Set up the graphql interface
		graphiql: true,
		// Format the error
		formatError(err) {
			if (!err.originalError) {
				return err;
			}
			const data = err.originalError.data;
			const message = err.message || 'An error occurred';
			const code = err.originalError.code || 500;
			return { message: message, status: code, data: data };
		},
	})
);
// Error middleware
app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

console.log('Start db connection');
dbConnection
	.then((result) => {
		console.log('DB Connected!');
		app.listen(8080);
	})
	.catch((err) => {
		console.log(err);
	});
