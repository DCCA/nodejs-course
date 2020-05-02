const express = require('express');
const bodyParser = require('body-parser');

// Import routes
const feedRoutes = require('./routes/feed');
// Create app
const app = express();
// App set up
app.use(bodyParser.json());
// Fix the CORS error and set headers
app.use((req, res, next) => {
	// Set domains
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Set the methods
	res.setHeader(
		'Access-Control.Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	//
	res.setHeader('Acess-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});
// Routes
app.use('/feed', feedRoutes);

app.listen(8080);
