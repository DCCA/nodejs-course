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
    constructor(t) {
        this.title = t;
    }

    save() {
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

}