const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email){
        this.name = username;
        this.email = email
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