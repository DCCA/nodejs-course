const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
	constructor(username, email, cart, _id) {
		this.name = username;
		this.email = email;
		this.cart = cart;
		this._id = _id;
	}

	save() {
		// Get db
		const db = getDb();
		let dbOp;
		// Get collection
		dbOp = db.collection('users').insertOne(this);
		// Save the user
		return dbOp
			.then((result) => {
				console.log('User created');
			})
			.catch((err) => {
				throw err;
			});
	}

	addToCart(product) {
		console.log(product._id);
		const cartProductIndex = this.cart.items.findIndex((cp) => {
			console.log(cp);
			return cp.productId.toString() === product._id.toString();
		});
		let newQuantity = 1;
		const updateCartItems = [...this.cart.items];
		// let updateCartItems = [];
		// If the item already exists in the cart
		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updateCartItems[cartProductIndex].quantity = newQuantity;
		}
		// If the item does not exist in the cart
		else {
			updateCartItems.push({
				productId: new mongodb.ObjectID(product._id),
				quantity: newQuantity,
			});
		}
		const updateCart = {
			items: updateCartItems,
		};
		const db = getDb();
		return db
			.collection('users')
			.updateOne(
				{ _id: new mongodb.ObjectId(this._id) },
				{ $set: { cart: updateCart } }
			);
	}

	getCart() {
		const db = getDb();
		const productIds = this.cart.items.map((i) => {
			return i.productId;
		});
		console.log(this.cart);
		console.log(productIds);
		console.log(
			db
				.collection('products')
				.find({ _id: { $in: [productIds] } })
				.toArray()
				.then((products) => {
					return products.map((p) => {
						return {
							...p,
							quantity: this.cart.items.find((i) => {
								return i.productId.toString() === p._id.toString();
							}).quantity,
						};
					});
				})
				.catch((err) => {
					throw err;
				})
		);
		return db
			.collection('products')
			.find({ _id: { $in: productIds } })
			.toArray()
			.then((products) => {
				return products.map((p) => {
					return {
						...p,
						quantity: this.cart.items.find((i) => {
							return i.productId.toString() === p._id.toString();
						}).quantity,
					};
				});
			})
			.catch((err) => {
				throw err;
			});
	}

	static findById(userId) {
		const db = getDb();
		return db
			.collection('users')
			.find({ _id: new mongodb.ObjectID(userId) })
			.next()
			.then((user) => {
				console.log(user);
				return user;
			})
			.catch((err) => {
				throw err;
			});
	}
}

module.exports = User;
