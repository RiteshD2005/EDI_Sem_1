const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "EDI_Database",
    dateStrings: true,
});

(async () =>{
    try {
        const connection = await db.getConnection();
        console.log("✅ Successfully connected to Database");
        connection.release(); // release back to pool
    } catch (err) {
        console.error("❌ Failed to connect to Database:", err.message);
    }
})();

module.exports = db;