const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/cart', shopController.getProductsCart);

router.get('/products', shopController.getProductsList);

router.get('/checkout', shopController.getCheckout);

router.get('/orders', shopController.getOrders);

router.get('/', shopController.getIndex);

module.exports = router;
