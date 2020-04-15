const fs = require('fs');
const path = require('path');

const Cart = require('../models/cart');
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
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if(this.id) {
                // Get the right product
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                // Create new array to update the existing product
                const updatedProducts = [...products];
                // Overwrite the existing product with the updated version
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                // Write the products into the files again
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile( products => {
            const product = products.find(prod => prod.id === id);
            // Get only the products that are not being deleted
            const updatedProducts = products.filter( prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price)
                }
                console.log(err);
            })
        })
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