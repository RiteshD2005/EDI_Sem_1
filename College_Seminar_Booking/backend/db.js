const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "127.0.0.1",
    port:"3306",
    user: "root",
    password: "root",
    database: "edi_database",
    dateStrings: true,
});

(async () =>{
    try {
        const connection = await db.getConnection();
        console.log("✅ Successfully connected to Database");
        connection.release();
    } catch (err) {
        console.error("❌ Failed to connect to Database:", err.message);
    }
})();

module.exports = db;