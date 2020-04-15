const fs = require('fs');
const path = require('path');
// Set the path to the JSON file
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = cb => {
    // Read the file content
    fs.readFile(p, (err, fileContent) => {
        if(err) {
            return cb([]);
        }
        return cb(JSON.parse(fileContent)); 
    })
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            // Write the products into the files again
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile( products => {
            const product = products.find( p => p.id === id);
            cb(product);
        })
    }
}