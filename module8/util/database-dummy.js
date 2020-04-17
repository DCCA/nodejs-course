const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'wbench', '<add-password>', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;