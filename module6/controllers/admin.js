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

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if(!editMode){
		return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId, product => {
		if(!product) {
			return res.redirect('/');
		}
		res.render('admin/edit-product', {
			pageTitle: 'Edit Products',
			path: '/admin/edit-product',
			editing: editMode,
			product: product,
		});
	})
}

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Products',
		path: '/admin/add-product',
		editing: false,
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