const mysql = require('mysql');

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"Seminar_db"
});

db.connect((err) => {
    if(err){
        console.error('DATABASE CONNECTION FAILED:',err);
        return;
    }
    console.log('DATABASE CONNECTED');
});

module.exports = db;