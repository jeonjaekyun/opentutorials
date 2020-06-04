var mysql = require('mysql');
var db = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: '',
    multipleStatements:true //여러개의 query 입력이 가능하게됨
});
db.connect();

module.exports = db;