const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
app.use(cors());
app.use(bodyParser.json());

const authRoute = require("./routes/auth");
app.use("/api", authRoute);

const requestRoute = require("./routes/request");
app.use("/api", requestRoute);

const historyRoute = require("./routes/History");
app.use("/api", historyRoute);

const SlotsRoute = require("./routes/Slotspg");
app.use("/api",SlotsRoute);

const AdminPendingReqs = require("./adminroutes/pendingRequest");
app.use("/api",AdminPendingReqs);

const DailySlots = require("./adminroutes/BookedPanel");
app.use("/api/admin",DailySlots);

const Countroute = require("./adminroutes/Count");
app.use("/api/admin", Countroute);

const adminRegistration = require("./adminroutes/AdminRegistration");
app.use("/api/admin",adminRegistration);

const PORT = 5000;
app.listen(PORT,() => console.log(`Server Running at Port: ${PORT}`));