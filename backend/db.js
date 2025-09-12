const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "mainline.proxy.rlwy.net",
    port:"28705",
    user: "root",
    password: "aFvHjYRkUbFaxhXhGcfcMxfGNgbszWtS",
    database: "railway",
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
