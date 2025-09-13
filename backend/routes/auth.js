const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.post("/auth/register", async (req,res) =>{
    try{
        const {Fullname , PRN , email , branch , password} = req.body;

        const [rows] = await db.query("SELECT * FROM users WHERE email = ?",[email]);
        if (rows.length > 0){
            return res.status(400).json({success:false,message:"Email already exist"});
        }

        const hashpass = await bcrypt.hash(password,10);

        await db.query("INSERT INTO users (Fullname ,PRN , email , branch , password) VALUES (?,?,?,?,?)",[Fullname,PRN,email,branch,hashpass]);
        return res.json({success:true, message: "Account created successfully" });

    }catch(err){
        console.log(err.message);
        return res.status(500).json({success:false,error : err.message});
    }
});

router.post("/auth/login", async (req,res) => {
    try{
        const {email , password} = req.body;

        const [rows] = await db.query(
            "SELECT id AS id, Fullname, PRN, email, branch, password ,'user' as role FROM users WHERE email = ? "
            + "UNION ALL " +
            "SELECT id , fullname, NULL as PRN, email , NULL as branch, password, 'admin' as role FROM adminuser WHERE email = ?"
            ,[email,email]);
        if(rows.length === 0){
            return res.json({success:false,message:"User does not exist"});
        }

        const user = rows[0];

        const ismatch = await bcrypt.compare(password , user.password);
        if(!ismatch) return res.json({success:false,message:"Invalid Credentials"});

        const token = jwt.sign({id:user.id, email: user.email, PRN: user.PRN, name: user.Fullname, branch: user.branch, role: user.role }, "My_Super_Secret_Key_123" , { expiresIn: "1h" });

        console.log(user.id);

        return res.json({
            success:true,
            token,
            user:{
                id:user.id,
                name:user.Fullname,
                email:user.email, 
                PRN:user.PRN, 
                branch:user.branch,
                role:user.role
            }
        });
    }catch(err){
        console.log(err.message)
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;
