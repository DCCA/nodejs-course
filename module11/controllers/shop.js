const fs = require('fs');
const path = require('path');

const STRIPE_API = require('../util/api-keys').STRIPE_API;
const stripe = require('stripe')(STRIPE_API);

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
	// TODO - Refactor this code, because is being shared in the getIndex too
	const page = +req.query.page || 1;
	let totalItems = 0;

	Product.find()
		.countDocuments()
		.then((numProd) => {
			totalItems = numProd;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'Products',
				path: '/',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		})
		.catch((err) => {
			// TODO - Refactor this to be a function and use that in all errors
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
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
		.catch((err) => {
			// TODO - Refactor this to be a function and use that in all errors
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getIndex = (req, res, next) => {
	const page = +req.query.page || 1;
	let totalItems = 0;

	Product.find()
		.countDocuments()
		.then((numProd) => {
			totalItems = numProd;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
			});
		})
		.catch((err) => {
			// TODO - Refactor this to be a function and use that in all errors
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			const products = user.cart.items;
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: products,
			});
		})
		.catch((err) => {
			// TODO - Refactor this to be a function and use that in all errors
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			console.log(result);
			res.redirect('/cart');
		});
};

exports.postCartDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.removeFromCart(prodId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => {
			// TODO - Refactor this to be a function and use that in all errors
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getCheckout = (req, res, next) => {
	let products;
	let total = 0;
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			products = user.cart.items;
			total = 0;
			products.forEach((p) => {
				total += p.quantity * p.productId.price;
			});
			return stripe.checkout.sessions.create({
				payment_method_types: ['card'],
				line_items: products.map((p) => {
					return {
						name: p.productId.title,
						description: p.productId.description,
						amount: p.productId.price * 100,
						currency: 'usd',
						quantity: p.quantity,
					};
				}),
				success_url:
					req.protocol + '://' + req.get('host') + '/checkout/success',
				cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
			});
		})
		.then((session) => {
			console.log(session);
			res.render('shop/checkout', {
				path: '/checkout',
				pageTitle: 'Checkout',
				products: products,
				totalSum: total,
				sessionId: session.id,
			});
		})
		.catch((err) => {
			// TODO - Refactor this to be a function and use that in all errors
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			const products = user.cart.items.map((i) => {
				return { quantity: i.quantity, product: { ...i.productId._doc } };
			});
			const order = new Order({
				user: {
					email: req.user.email,
					userId: req.user,
				},
				products: products,
			});
			return order.save();
		})
		.then((result) => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect('/orders');
		})
		.catch((err) => {
			// TODO - Refactor this to be a function and use that in all errors
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
			});
		})
		.catch((err) => {
			// TODO - Refactor this to be a function and use that in all errors
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		// Check if the user is the same from the session
		.then((order) => {
			if (!order) {
				return next(new Error('No order found.'));
			}
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error('Unauthorized!'));
			}
			const invoiceName = 'invoice-' + orderId + '.pdf';
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader(
				'Content-Disposition',
				'inline; filename="' + invoiceName + '"'
			);
			const invoicePath = path.join('data', 'invoices', invoiceName);

			const pdfDoc = new PDFDocument();
			pdfDoc.pipe(fs.createWriteStream(invoicePath));
			pdfDoc.pipe(res);

			pdfDoc.fontSize(26).text('Invoice', {
				underline: true,
			});
			pdfDoc.text('-----------------------------------');
			let totalPrice = 0;

			order.products.forEach((p) => {
				totalPrice += p.quantity * p.product.price;
				pdfDoc
					.fontSize(14)
					.text(
						p.product.title +
							' - ' +
							p.quantity +
							' X ' +
							'$ ' +
							p.product.price
					);
			});
			pdfDoc.text('-----------------------------------');
			pdfDoc.fontSize(20).text(`Total Price: $ ${totalPrice}`);

			pdfDoc.end();
			// fs.readFile(invoicePath, (err, data) => {
			// 	if (err) {
			// 		return next(err);
			// 	}
			// 	res.setHeader('Content-Type', 'application/pdf');
			// 	res.setHeader(
			// 		'Content-Disposition',
			// 		'inline; filename="' + invoiceName + '"'
			// 	);
			// 	res.send(data);
			// });

			// Pass the file data in parts, no entirely
			// const file = fs.createReadStream(invoicePath);
			// res.setHeader('Content-Type', 'application/pdf');
			// res.setHeader(
			// 	'Content-Disposition',
			// 	'inline; filename="' + invoiceName + '"'
			// );
			// file.pipe(res);
		})
		.catch((err) => next(err));
};

exports.getCheckoutSuccess = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			const products = user.cart.items.map((i) => {
				return { quantity: i.quantity, product: { ...i.productId._doc } };
			});
			const order = new Order({
				user: {
					email: req.user.email,
					userId: req.user,
				},
				products: products,
			});
			return order.save();
		})
		.then((result) => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect('/orders');
		})
		.catch((err) => {
			// TODO - Refactor this to be a function and use that in all errors
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
