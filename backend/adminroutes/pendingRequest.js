const express = require('express');
const db = require('../db');
const router = express.Router();

router.post("/admin/PendingRequest", async (req,res) =>{
    
    try{
        const [pendreqs] = await db.query("SELECT m.* , g.* FROM MasterTable m LEFT JOIN Guest_data g ON m.request_id = g.request_id WHERE Status = 'Pending' ORDER BY m.created_at ASC");
        
        if (pendreqs.length === 0) return res.json({message:"No Request for the Day"});

        return res.json(pendreqs)
    }catch(err){
        console.log(err.message);
        return res.status(500).json({message:"unable to connect to Database"});
    }
});

router.post("/admin/Action", async (req ,res) => {
    const {Request_id,Date,STime,ETime,Action} = req.body;
    
    try{
        if(Action==="Rejected"){
            await db.query("UPDATE MasterTable SET Status = ? WHERE Request_id = ?",[Action,Request_id]);
            return res.json({Success: true});
        }
        [check] = await db.query("SELECT * FROM MasterTable WHERE EventDate =? And Status = 'Accepted' AND StartTime < ? AND EndTime > ? ORDER BY StartTime ASC", [Date , ETime , STime]);
        if(check.length > 0){
            return res.status(402).json({Success: false})
        }
        await db.query("UPDATE MasterTable SET Status = ? WHERE Request_id = ?",[Action,Request_id]);
        return res.json({Success: true});
    }catch(err){
        console.log(err.message);
        return res.json({Success:false,message:err.message});
    }
})

module.exports = router;