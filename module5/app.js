const express = require('express');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const bodyParser = require('body-parser');

//const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');

const app = express();

// Set manually the handlebars view engine
// app.engine(
// 	'hbs',
// 	expressHbs({
// 		layoutsDir: 'views/layouts/',
// 		defaultLayout: 'main-layout',
// 		extname: 'hbs',
// 	})
// );

// Set EJS as template engine
app.set('view engine', 'ejs');
// Set handlebars as template engine
// app.set('view engine', 'hbs');
// Set the pug template engine
// app.set('view engine', 'pug');

app.set('views', 'views');

// Active to get data from forms
app.use(bodyParser.urlencoded({ extended: false }));
// Let express serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);

// app.post() > works only for post request
// app.get() > works only for get request
