const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				path: '/',
				pageTitle: 'Shop',
			});
		})
		.catch((err) => console.log(err));
};

exports.getProductsList = (req, res, next) => {
	Product.fetchAll()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				title: 'Products List',
				path: '/products',
				pageTitle: 'Products List',
			});
		})
		.catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => console.log(err));
};

exports.getProductsCart = (req, res, next) => {
	req.user
		.getCart()
		.then((products) => {
			console.log(products);
			res.render('shop/cart', {
				pageTitle: 'Cart',
				path: '/cart',
				products: products,
			});
		})
		.catch((err) => console.log(err));
};

exports.postProductsCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			req.user.addToCart(product);
		})
		.then((result) => {
			console.log(result);
			res.redirect('cart');
		})
		.catch((err) => {
			throw err;
		});
};

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.deleteItemFromCart(prodId)
		.then((result) => {
			console.log(result);
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
	req.user
		.addOrder()
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders()
		.then((orders) => {
			res.render('shop/orders', {
				pageTitle: 'Orders',
				path: '/orders',
				orders: orders,
			});
		})
		.catch((err) => {
			throw err;
		});
};
