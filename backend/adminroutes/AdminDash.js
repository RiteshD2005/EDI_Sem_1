const express = require("express");
const db = require('../db');
const router = express.Router();

router.post("/admin/Dashboard", async (req,res) => {
    const {selecteddate} = req.body
    try{
        
        
    }catch(err){
        console.log(err.message);
        return res.status(500).json("unable to connect");
    }
});