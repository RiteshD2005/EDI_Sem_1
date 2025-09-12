const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.post("/registration", async (req,res) =>{
    try{
        const {FullName , email , password} = req.body;

        const [rows] = await db.query("SELECT * FROM users WHERE email = ?",[email]);
        if (rows.length > 0){
            return res.json({color:"red",message:"Email already exist as User"});
        }
        const [row] = await db.query("SELECT * FROM adminuser WHERE email = ?",[email]);
        if (row.length > 0){
            return res.json({color:"red",message:"Email already exist as Admin"});
        }

        const hashpass = await bcrypt.hash(password,10);

        await db.query("INSERT INTO adminuser (Fullname , email , password) VALUES (?,?,?)",[FullName,email,hashpass]);
        return res.json({color:"green", message: "Account Added successfully" });

    }catch(err){
        console.log(err.message);
        return res.status(500).json({color:"red",error : err.message});
    }
});

module.exports = router