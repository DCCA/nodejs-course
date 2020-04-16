const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'wbench', 'D@ni12345', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;