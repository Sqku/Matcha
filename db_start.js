let mysql = require('mysql');

let connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3307',
    user     : 'root',
    password : '',
    database : 'matcha'
});


module.exports = connection;
