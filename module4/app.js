const express = require('express');
const path = require('path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const bodyParser = require('body-parser');

const expressHbs = require('express-handlebars');

const app = express();

// Set manually the view engine
app.engine(
	'hbs',
	expressHbs({
		layoutsDir: 'views/layouts/',
		defaultLayout: 'main-layout',
		extname: 'hbs',
	})
);

// Set handlebars as template engine
app.set('view engine', 'hbs');
// Set the pug template engine
// app.set('view engine', 'pug');

app.set('views', 'views');

// Active to get data from forms
app.use(bodyParser.urlencoded({ extended: false }));
// Let express serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res) => {
	res.status(404).render('404');
});

app.listen(3000);

// app.post() > works only for post request
// app.get() > works only for get request
