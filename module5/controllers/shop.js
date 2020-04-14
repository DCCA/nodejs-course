const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
	Product.fetchAll((products) => { 
		res.render('shop/index', {
			prods: products,
			path: '/',
			pageTitle: 'Shop Dyn',
		});
	});
};

exports.getProductsList = (req, res, next) => {
	Product.fetchAll((products) => { 
		res.render('shop/product-list', {
			prods: products,
			title: 'Products List',
			path: '/products',
			pageTitle: 'Products List',
		});
	});
};

exports.getProductsCart = (req, res, next) => {
    res.render('shop/cart', {
		pageTitle: 'Cart',
		path: '/cart',
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout',
	});
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		pageTitle: 'Orders',
		path: '/orders',
	});
};