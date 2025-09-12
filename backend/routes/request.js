const express = require("express");
const db =  require('../db');
const router = express.Router();

router.post("/SendRequest", async (req,res) => {
    try{const formData = req.body.formData;

    const [taken] = await db.query(
        `SELECT * FROM MasterTable 
        WHERE EventDate = ? AND StartTime = ? AND EndTime =? AND Status = ?`
        ,[formData.date,formData.starttime,formData.endtime , "Accepted"]
    );
    if(taken.length > 0) return res.json({message:" Slot Already taken",success:"failed"})

    await db.query(`
        INSERT INTO MasterTable
        (user_id,Club_Name ,Club_No ,Postion ,EventTitle ,EventType ,EventDate ,StartTime ,EndTime ,Subject ,Description)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
            formData.user_id,
            formData.ClubName,
            formData.ClubNo,
            formData.position,
            formData.EventTitle,
            formData.EventType,
            formData.date,
            formData.starttime,
            formData.endtime,
            formData.subject,
            formData.description
        ]
    )

    const [newrequestID] = await db.query(`SELECT Request_id FROM MasterTable WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,[formData.user_id]);
    if(newrequestID.length === 0) return res.status(400).json({message:"failed to generate RequestID",success:"failed"});

    await db.query(`
        INSERT INTO Guest_data
        (Request_id, GuestName ,GuestDesignation ,GuestContact ,Buget_income, Buget_Expenditure, SourceFund)
        VALUES (?,?,?,?,?,?,?)`
        ,[
            newrequestID[0].Request_id,
            formData.GuestName,
            formData.GuestDesignation,
            formData.GuestContact,
            formData.Income,
            formData.Expenditure,
            formData.SourceofFund
        ])

    return res.json({ReqID: newrequestID[0].Request_id, message:"Request sent Successfully",success:"success"});

    }catch(err){    
        console.log(err.message);
        return res.status(500).json({message:"Failed to send request"});
    }
});

module.exports = router;