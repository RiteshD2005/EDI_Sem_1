import React, { useState } from "react";
import axios from "axios";
// import { Link } from 'react-router-dom';
import Navbar from "./Nav"
import "./dashboard.css"

function Sendreq() {
    const [formData, setFormData] = useState({
        position: "",
        date: "",
        days: "",
        starttime: "",
        endtime: "",
        subject: "",
        details: "",
    });

    const [message, setMessage] = useState("");
    const [AfterContainer, setAfterContainer] = useState(false);
    const [aftermessage, setAftermessage] = useState("");
    const [errmessage, setErrmessage] = useState("");

    const handlechange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        const isempty = Object.values(formData).some((value) => value.trim() === "");

        if (isempty) {
            setMessage("Fill all the fields");
            return;
        } else {
            console.log(formData);
            setAfterContainer(true);
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/request", formData);
            setAfterContainer(true);
            if (res.data.success) {
                setAftermessage("Request Sent Successfully");
                setErrmessage("");
                console.log(res.data);
            } else {
                setAftermessage("Failed to send Request. Try again.");
                setErrmessage(res.data.message);
                console.log(res.data);
            }

        } catch (err) {
            console.log(err);
            setAfterContainer(true);
            setAftermessage("Unable to connect at the moment. Try again later.")
            setErrmessage(err.message);
        }
    };

    return (
        <div>
            <Navbar />
            {!AfterContainer ? (
                <div className="Request">
                    <h1>Send Request</h1>
                    <div className="Req-Container">
                        <div className="item" id="item1">
                            <label>Name: </label>
                            <input
                                type="text"
                                placeholder=""
                                disabled />
                        </div>
                        <div className="item" id="item2">
                            <label>Position: </label>
                            <input
                                type="text"
                                name="position"
                                placeholder="Club President , Department Representative, etc."
                                value={formData.position}
                                onChange={handlechange}
                            />
                        </div>
                        <div className="datecont" id="item3">
                            <div className="item" id="item3a">
                                <label>Date: </label>
                                <input type="date" name="date" value={formData.date} onChange={handlechange} />
                            </div>
                            <div className="item" id="item3b">
                                <label>Days: </label>
                                <input type="number" name="days" placeholder="0" value={formData.days} onChange={handlechange} />
                            </div>
                        </div>
                        <div className="timecont" id="item4">
                            <div className="item" id="item4a">
                                <label>Start Time: </label>
                                <input type="time" name="starttime" value={formData.starttime} onChange={handlechange} />
                            </div>
                            <div className="item" id="item4b">
                                <label>End Time: </label>
                                <input type="time" name="endtime" value={formData.endtime} onChange={handlechange} />
                            </div>
                        </div>
                        <div className="item" id="item5">
                            <label>Subject: </label>
                            <input type="text" name="subject" value={formData.subject} onChange={handlechange} />
                        </div>
                        <textarea name="details" id="item7" placeholder="Enter the Details" value={formData.details} onChange={handlechange}></textarea>
                        <div className="messagebox">{message}</div>

                        <div className="buttons">
                            <button type="reset" id="Clear" onClick={() => {
                                setMessage("");
                                setFormData({
                                position: "", 
                                date: "",
                                days: "",
                                starttime: "",
                                endtime: "",
                                subject: "",
                                details: "",
                            })}}>Clear Form</button>
                            <button type="submit" id="Send" onClick={handlesubmit}>Send</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="Request">
                    <div className="AfterContainer">
                        <div id="successmess">
                            {aftermessage}
                            <p>  error:{errmessage}</p>
                        </div>
                        <div className="buttons">
                            <button id="Next">Back To Home</button>
                            <button id="back" onClick={() => setAfterContainer(false)}>Send Again</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sendreq;