// database.js
const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Smsurekha19@',
  database: 'healthify',
};

const connection = mysql.createConnection(dbConfig);

connection.connect(function (error) {
  if (error) {
    console.error('Error connecting to database:', error.message);
    return;
  }
  console.log('MySQL Database is connected successfully');
});

module.exports = connection;
