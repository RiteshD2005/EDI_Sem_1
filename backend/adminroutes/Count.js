const express = require("express");
const db = require('../db');
const router = express.Router();

router.post("/Counts",async (req ,res)=>{
    let count = [0,0,1];

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;
    console.log(formatted);

    try{

        [daytotal] = await db.query("SELECT COUNT(Status) AS total From MasterTable WHERE Status = 'Accepted' AND EventDate = ?", [formatted]);
        [pendingtotal] = await db.query("SELECT COUNT(Status)AS total From MasterTable WHERE Status = 'Pending'");

        count[0] = daytotal[0].total;
        count[1] = pendingtotal[0].total;
        // console.log(count);
        return res.json(count);
    }catch(err){
        console.log(err.message);
        return res.status(500).json({message: "Unable to connect to db "});
    }

});

module.exports = router;