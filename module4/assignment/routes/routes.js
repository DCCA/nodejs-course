const express = require('express');
const router = express.Router();
const users = [];

router.post('/create-user', (req, res) => {
    console.log('Create User Route');
    console.log(req.body);
    users.push(req.body);
    console.log(users);
    res.redirect('/')
})

router.get('/add-users', (req, res) => {
    console.log('Home');
    res.render('add-users');
})

router.get('/', (req, res) => {
    console.log('Home');
    res.render('users', {users: users});
})

exports.router = router;
exports.users = users;