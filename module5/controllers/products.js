const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('add-product', {
		pageTitle: 'Add Products Dyn',
		path: '/admin/add-product',
		activeAddProduct: true,
		formsCSS: true,
	});
}

exports.postAddProduct = (req, res) => {
	const product = new Product(req.body.title);
	product.save();
	res.redirect('/');
}

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => { 
		res.render('shop', {
			prods: products,
			title: 'Shop Nice',
			path: '/',
			pageTitle: 'Shop Dyn',
			hasProducts: products.length > 0,
			activeShop: true,
			productCSS: true,
		});
	});
}
 