const Product = require('../models/product');

exports.postAddProduct = (req, res) => {
	const title = req.body.title;
	const price = req.body.price;
	const imageUrl = req.body.imageUrl
	const description = req.body.description
	const product = new Product(title, imageUrl, description, price);
	product.save();
	res.redirect('/');
}

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {
		pageTitle: 'Add Products Dyn',
		path: '/admin/add-product',
	});
}

exports.getProductsAdmin = (req, res, next) => {
	Product.fetchAll((products) => { 
		res.render('admin/products', {
			prods: products,
			title: 'Admin Products List',
			path: '/admin/products',
			pageTitle: 'Products List',
			hasProducts: products.length > 0,
		});
	});
}