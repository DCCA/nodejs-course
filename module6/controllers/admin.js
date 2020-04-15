const Product = require('../models/product');

exports.postAddProduct = (req, res) => {
	const title = req.body.title;
	const price = req.body.price;
	const imageUrl = req.body.imageUrl
	const description = req.body.description
	const product = new Product(null, title, imageUrl, description, price);
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

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUr;;
	const updatedDescription = req.body.Description;
	const updateProduct = new Product(
		prodId, 
		updatedTitle, 
		updatedImageUrl, 
		updatedDescription, 
		updatedPrice);
	updateProduct.save();
	res.redirect('/admin/products')
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

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	//TODO - Implement a Call Back so we just redirect once the delete is done
	Product.deleteById(prodId);
	res.redirect('/admin/products');
}