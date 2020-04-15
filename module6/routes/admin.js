const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/products', adminController.getProductsAdmin);

router.get('/add-product', adminController.getAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/add-product', adminController.postAddProduct);

module.exports = router;
