const express = require("express");
const db = require('../db');
const router = express.Router();

router.post("/reportstat", async (req, res) => {

    try {
        // Today Accepted
        const [total] = await db.query(
            "SELECT COUNT(*) AS total FROM MasterTable"
        );

        // Pending Count
        const [pending] = await db.query(
            "SELECT COUNT(*) AS total FROM MasterTable WHERE Status = 'Pending'"
        );

        // Total Accepted (all time)
        const [totalAccepted] = await db.query(
            "SELECT COUNT(*) AS total FROM MasterTable WHERE Status = 'Accepted'"
        );

        // Total Rejected
        const [totalRejected] = await db.query(
            "SELECT COUNT(*) AS total FROM MasterTable WHERE Status = 'Rejected'"
        );

        const [User] = await db.query(
            "SELECT COUNT(*) AS total FROM Users"
        );

        const [totalBuget] = await db.query(
            "SELECT SUM(Buget_Expenditure) AS total FROM guest_data"
        );

        console.log( total[0].total,pending[0].total ,totalAccepted[0].total, totalRejected[0].total);

        return res.json({
            Total: total[0].total,
            pending: pending[0].total,
            accepted: totalAccepted[0].total,
            rejected: totalRejected[0].total,
            Buget : totalBuget[0].total,
            userCount : User[0].total
        });

    } catch (err) {
        console.error("ReportStat Error:", err.message);
        return res.status(500).json({ message: "Unable to fetch report statistics" });
    }

});

module.exports = router;