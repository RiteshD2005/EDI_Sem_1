const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    methods: ["GET","POST"],
    credentials: true
}));
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});