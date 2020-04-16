// Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// Connection to DB
const db = require('./util/database');
// App
const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Active to get data from forms
app.use(bodyParser.urlencoded({ extended: false }));
// Let express serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Active routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
// Start server
app.listen(3000);