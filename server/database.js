import mysql from 'mysql2';

export const database = mysql.createConnection({
    // host: 'localhost',
    // user: "root",
    // password: '',
    // database: ''
});

//create and add your own db here

//check if the connection is successful
