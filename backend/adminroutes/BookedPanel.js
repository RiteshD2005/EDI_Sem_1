const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/todayslot", async (req, res) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;

    try {
        const [slots] = await db.query(
            "SELECT * FROM MasterTable WHERE EventDate = ? AND Status = 'Accepted' ORDER BY StartTime ASC",
            [formatted]
        );
        res.json(slots);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Failed" });
    }
});


router.post("/upcomingslot", async (req , res) => {
    
    const {formatted} = req.body;
    console.log(formatted);

    try{
        const [slots] = await db.query("SELECT * FROM MasterTable Where EventDate = ? AND Status = 'Accepted' ORDER BY StartTime ASC", [formatted]);
        res.json(slots);
    }catch(err){
        console.log(err.message);
        res.status(500).json({message:"Failed"});
    }
});

module.exports = router;