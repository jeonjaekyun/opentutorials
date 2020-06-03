var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'jm',
    password:'jm1234',
    database:'opentutorials'
});

connection.connect();

connection.query('SELECT COUNT(*) AS count from author', function(err, result){
    if(err){
        console.log(err);
    }
    console.log(result);
    console.log('The author\'s count is : ',result[0].count);
});

connection.end();