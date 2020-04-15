const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then(([rows]) => {
			res.render('shop/index', {
				prods: rows,
				path: '/',
				pageTitle: 'Shop Dyn',
			});
		})
		.catch(err => console.log(err));
};

exports.getProductsList = (req, res, next) => {
	Product.fetchAll()
		.then(([rows]) => {
			res.render('shop/product-list', {
				prods: rows,
				title: 'Products List',
				path: '/products',
				pageTitle: 'Products List',
			});
		})
		.catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(([product]) => {
			res.render('shop/product-detail', {
				product: product[0],
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch( err => console.log(err));
}

exports.getProductsCart = (req, res, next) => {
	Cart.getProducts( cart => {
		Product.fetchAll(products => {
			const cartProducts = [];
			for ( product of products ) {
				const cartProductData = cart.products.find(prod => prod.id === product.id);
				if (cartProductData) {
					cartProducts.push({productData: product, qty: cartProductData.qty});
				}
			}		
			res.render('shop/cart', {
				pageTitle: 'Cart',
				path: '/cart',
				products: cartProducts,
			});
		})
	})
};

exports.postProductsCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.addProduct(prodId, product.price);
	});
	res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, product => {
		Cart.deleteProduct(prodId, product.price);
		res.redirect('/cart');
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