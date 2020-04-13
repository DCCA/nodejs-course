const express = require('express');
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
// Let express serve static files
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);

// app.post() > works only for post request
// app.get() > works only for get request