const express = require('express');
const bodyParser = require('body-parser');

// Import routes
const data = require('./routes/routes');

const app = express();

// Set the view engine and the folder for views
app.set('view engine', 'ejs');
app.set('views', 'views')

// Add the bodyParser to the app to receive data
app.use(bodyParser.urlencoded({ extended: true}))

// Add routes to the app
app.use(data.router);

// 404 routes
app.use('/', (req, res) => {
    console.log('Connected');
    res.status(200).render('404');
})

// Start the app
app.listen(3000);