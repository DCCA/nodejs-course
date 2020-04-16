// Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// Connection to DB
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
// App
const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Active to get data from forms
app.use(bodyParser.urlencoded({ extended: false }));
// Let express serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch( err => console.log(err));
})

// Active routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Relate data with sequelize
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

// Sync the DB
sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        return User.findByPk(1)
            // Start server
        })
        .then(user => {
            if(!user) {
                return User.create({
                    name: 'Daniel',
                    email: 'dcca12@gmail.com'
                })
            }
            return Promise.resolve(user);
        })
        .then(user => {
            return user.createCart();
        })
        .then( cart => {
            app.listen(3000);
        })
        .catch(err => console.log(err));
        