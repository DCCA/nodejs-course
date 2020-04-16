const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'wbench',
    database: 'node-complete',
    password: 'D@ni12345'
});

module.exports = pool.promise();