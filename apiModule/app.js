const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const dbConnection = require('./utils/database').dbConnection;
const path = require('path');

// Import routes
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
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
	next();
});
// Routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
// Error middleware
app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

dbConnection
	.then((result) => {
		console.log('DB Connected!');
		app.listen(8080);
	})
	.catch((err) => {
		console.log(err);
	});
