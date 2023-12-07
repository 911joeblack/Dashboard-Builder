const mysql = require('mysql2');

const pool = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',    
  password : 'password', 
  database : 'dashboard_db'      
});

module.exports = pool.promise();