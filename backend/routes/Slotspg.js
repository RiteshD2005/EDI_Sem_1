const express = require("express");
const db = require('../db');
const router = express.Router();

function split_time(array, booking) {
    const newSlot = [];

    array.forEach((slot) => {
        if (slot.EndTime <= booking.StartTime || slot.StartTime >= booking.EndTime) {
            newSlot.push(slot);
        } else {
            if (slot.StartTime < booking.StartTime) {
                newSlot.push({
                    StartTime: slot.StartTime,
                    EndTime: booking.StartTime,
                    Status: "Free",
                });
            }
            newSlot.push({
                StartTime: booking.StartTime,
                EndTime: booking.EndTime,
                Status: "Booked",
                ...booking, // include all booking fields (Club_Name, EventTitle, etc.)
            });

            if (slot.EndTime > booking.EndTime) {
                newSlot.push({
                    StartTime: booking.EndTime,
                    EndTime: slot.EndTime,
                    Status: "Free",
                });
            }
        }
    });

    return newSlot;
}

router.post("/slot", async (req, res) => {
    const { selectedDate } = req.body;

    try {
        [result] = await db.query(
            `SELECT Request_id, EventDate, StartTime, EndTime FROM MasterTable WHERE Status = 'Accepted' AND EventDate = ? ORDER BY StartTime ASC`, [selectedDate]
        );

        let slots = [
            { StartTime: "08:00:00", EndTime: "18:00:00", Status: "Free" },
        ];

        result.forEach(element => {
            slots = split_time(slots, element);
        });

        return res.json(slots);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Failed to fetch data" });
    }

});

module.exports = router;