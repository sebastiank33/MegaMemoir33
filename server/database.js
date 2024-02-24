import mysql from 'mysql2';

export const database = mysql.createConnection({
    // host: 'localhost',
    // user: "root",
    // password: 'Soccerstar15!',
    // database: 'memDB'
});

//check if the connection is successful
