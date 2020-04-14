const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, res, next) => {
	console.log('shops:', adminData.products);
	const products = adminData.products;
	res.render('shop', { prods: products, title: 'Shop Nice' });
});

module.exports = router;
