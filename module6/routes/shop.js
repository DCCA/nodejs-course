const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/cart', shopController.getProductsCart);

router.post('/cart', shopController.postProductsCart);

router.get('/products', shopController.getProductsList);

// Setting a dynamic route
router.get('/products/:productId', shopController.getProduct);

router.get('/checkout', shopController.getCheckout);

router.get('/orders', shopController.getOrders);

router.get('/', shopController.getIndex);

module.exports = router;
