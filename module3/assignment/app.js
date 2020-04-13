const express = require('express');

const app = express();

app.use('/users', (req, res) => {
    res.send('<h1>This is the user path</h1>');
});

app.use('/', (req, res) => {
    res.send('<h1>Working!</h1>');
});

app.listen(3000);