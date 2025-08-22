const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = (req,res) => {
    const {Fullname, email, PRN, branch, password} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email],(err, result) => {
        if(err) return res.json({success: false, message: "DB Error"});
        if(result.length > 0) {
            return res.json({success: false, message: "Email already exists"});
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.json({ success: false, message: "Error hashing password" });

            // Insert into DB
            db.query(
                "INSERT INTO users (Fullname, email, PRN, branch, password) VALUES (?, ?, ?, ?, ?)",
                [Fullname, email, PRN, branch, hashedPassword],
                (err, result) => {
                    if (err) return res.json({ success: false, message: "DB insert error" });
                    return res.json({ success: true, message: "Registered successfully" });
                }
            );
        });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.json({ success: false, message: "DB error" });
        if (result.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }

        const user = result[0];

        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.json({ success: false, message: "Error checking password" });
            if (!isMatch) return res.json({ success: false, message: "Invalid password" });

            // Generate token
            const token = jwt.sign({ id: user.id, email: user.email }, "secretkey", { expiresIn: "1h" });

            return res.json({ success: true, message: "Login successful", token });
        });
    });
};

module.exports = { registerUser, loginUser };