const express = require("express");
const db =  require('../db');
const router = express.Router();

router.post("/history", async (req,res) =>{
    try{
        const {userid} = req.body;
        
        const [results] = await db.query(
            `SELECT m.* , g.* 
            FROM MasterTable m
            LEFT JOIN Guest_data g ON m.request_id = g.request_id
            Where user_id = ? ORDER BY m.created_at DESC`
            ,[userid]);
        
        return res.json(results);
    }catch(err){
        console.error(err.message);
        return res.status(404).json({message: "Failed to fetch data"});
    }
});

module.exports = router;