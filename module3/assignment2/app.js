// List
// 0. Add modules
// 1. Create server
// 2. Set routes
// 3. Create views
// 4. Create statics folder
// 5. Link the static files to the views

const express = require('express');
const path = require('path');
const mainRoutes = require('./routes/routes');

// Add the express to the app var
const app = express();

app.use(mainRoutes);
app.use(express.static('public'));

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start server
app.listen(3000);