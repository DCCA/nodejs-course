const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, cart, _id){
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
        return dbOp.then(result => {
            console.log('User created');
        }).catch(err => {
            throw err
        });
    }

    addToCart(product) {
        // const cartProduct = this.cart.items.findIndex(cp => {
        //     return cp._id === product._id
        // });
        const updateCart = {items: [{ productId: new mongodb.ObjectID(product._id), quantity: 1}]};
        const db = getDb();
        return db.collection('users').updateOne(
            {_id: new mongodb.ObjectId(this._id)}, 
            {$set: {cart: updateCart}});
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').find({_id: new mongodb.ObjectID(userId)})
            .next()
            .then(user => {
                console.log(user)
                return user;
            })
            .catch(err => {throw err})
    }
}

module.exports = User;