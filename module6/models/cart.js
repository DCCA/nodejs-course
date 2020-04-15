const fs = require('fs');
const path = require('path');

//Define the path to the data file
const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
    );

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0,
            }
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze cart |  1. Get the index | 2. Store the product, if it exists
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // Add or increase the quantity
            if (existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                // Overwrite the existing product with the updated product
                cart.products[existingProductIndex] = updatedProduct; 
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            // Increase the price
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        })
    }
}