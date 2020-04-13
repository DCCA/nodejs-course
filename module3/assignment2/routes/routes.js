const express = require('express');
const router = express.Router();
const path = require('path');
const rootPath = require('../helper/path');

router.get('/users', (req, res) => {
    res.sendFile(path.join(rootPath, 'views', 'users.html'));
});

router.get('/', (req, res) => {
    res.sendFile(path.join(rootPath, 'views', 'home.html'));
});

module.exports = router;