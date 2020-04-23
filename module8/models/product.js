const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if(this._id) {
           // Update the product
           dbOp = db.collection('products')
            .updateOne({
                _id: new mongodb.ObjectID(this._id)
                }, {
                    // Tell mongodb what operation it should do
                    $set: this
                });
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
                .then(result => {
                    console.log(result);
                })
                .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            // Get all documents in the products collection 
            .find()
            // Transform the cursor into a js array
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products')
            // Use the find method to get item by ID with the MongoDB ID
            .find({_id: new mongodb.ObjectId(prodId)})
            .next()
            .then(product => {
                return product;
            })
            .catch(err => console.log(err))
    }

    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products').deleteOne({
            _id: new mongodb.ObjectID(prodId)
        })
            .then(result => {
                console.log('Deleted');
            })
            .catch(err => {
                throw err
            });
    }
}

module.exports = Product;