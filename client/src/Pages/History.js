import React, { useState, useEffect } from "react";
import './Stylesheets/history.css'
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function History() {
    const [history, setHistory] = useState([]);
    // const [content, setContent] = useState(false);
    // const [status, getStatus] = useState("");
    // const [reqId, setReqId] = useState("");
    const [selected, setSelected] = useState(null);

    const histdata = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return "";

        let userid = null;

        try {
            const decoded = jwtDecode(token);
            userid = decoded.id;
            console.log("token found" + userid);
        } catch (err) {
            console.log("No token found");
            console.error(err.message);
        }

        try {
            const res = await axios.post(`http://localhost:5000/api/history`, { userid });
            setHistory(res.data);
            console.log("results:" + res.data)
        } catch (err) {
            console.log(err);
        }
    }

    const handlecolor = (item) => {
        if (item.Status === "Accepted") return "green"
        else if (item.Status === "Rejected") return "red"
        else return "grey"
    }

    useEffect(() => {
        histdata();
    }, []);

    return (
        <>
            <div className="hero-section">
                <h1>History</h1>
            </div>
            <div className="content">
                {(history.length === 0) ? (
                    <h1>Nothing found</h1>
                ) : (
                    history.map((item) => (
                        <div className="button-bar" onClick={() => { setSelected(item) }}>
                            <div className="reqId ">
                                <h4>RequestID: {item.Request_id}</h4>
                                <p>Date: {item.EventDate}</p>
                                <p>{item.StartTime} - {item.EndTime}</p>
                            </div>
                            <div className={`status-box ${handlecolor(item)}`}>{item.Status}</div>
                        </div>
                    ))
                )}
            </div>

            {selected && (
                <div className="selected-box">
                    <div className="detail-Container">
                        <h1 style={{ width: "100%", textAlign: "center" }}>Details</h1>

                        {/* MasterTable Data */}
                        <div className="detail-titl">
                            <p style={{ fontWeight: "600" }}>RequestID: {selected.Request_id}</p>
                            <p>User ID: {selected.user_id}</p>
                            <p>Date: {new Date(selected.EventDate).toLocaleDateString()}</p>
                            <p>Time: {selected.StartTime} - {selected.EndTime}</p>
                            <div className={`detail-stat ${handlecolor(selected)}`}>{selected.Status}</div>
                        </div>

                        <div className="detail-secondary">
                            <div className="club-detail">
                                <p>Club Name: {selected.Club_Name}</p>
                                <p>Club No: {selected.Club_No}</p>
                                <p>Post: {selected.Postion}</p>
                            </div>
                            <div className="event-detail">
                                <p>Event Title: {selected.EventTitle}</p>
                                <p>Event Type: {selected.EventType}</p>
                                <p>Subject: {selected.Subject}</p>
                            </div>
                        </div>

                        <div className="detail-desc">
                            <p>Description:</p>
                            <p>{selected.Description}</p>
                        </div>

                        {/* Guest_data (if exists) */}
                        {selected.SourceFund && (
                            <div className="guest-detail">
                                <h2>Guest Information</h2>
                                <p>Guest Name: {selected.GuestName}</p>
                                <p>Designation: {selected.GuestDesignation}</p>
                                <p>Contact: {selected.GuestContact}</p>
                                <p>Budget Income: {selected.Buget_income}</p>
                                <p>Budget Expenditure: {selected.Buget_Expenditure}</p>
                                <p>Source of Fund: {selected.SourceFund}</p>
                            </div>
                        )}

                        <p style={{ fontSize: "12px", marginTop: "10px", textAlign: "right" }}>
                            Created At: {new Date(selected.created_at).toLocaleString()}
                        </p>

                        <button className="detail-btn" onClick={() => setSelected(null)}>
                            Close
                        </button>
                    </div>
                </div>

            )}
        </>
    );
};

export default History;