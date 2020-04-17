// Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// Connection to DB
const mongoConnect = require('./util/database').mongoConnect;
// App
const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Active to get data from forms
app.use(bodyParser.urlencoded({ extended: false }));
// Let express serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch( err => console.log(err));
    next()
})

// Active routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);    
})