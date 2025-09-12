import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, Button, Table, Badge, Form} from "react-bootstrap";
import "./Admincss/Toast.css";

function Toastbox({message,color}){
    return <div className={`Toast ${color}`}>{message}</div>;
}

function PendingRequest() {
    const [pendingreq, setPendingReq] = useState([]);
    const [toast , setToast] = useState(null);
    const [selected, setSelected] = useState(null);

    const showtoast = (message , color = 'red') => {
        setToast({message,color});
        setTimeout(() => setToast(null),3000);
    }

    const fetchrequest = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/admin/PendingRequest');
            setPendingReq(res.data);
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        fetchrequest();
    }, []);

    const handleCheck = async (Request_id,Date,STime,ETime,Action) => {
        try{
            const res = await axios.post('http://localhost:5000/api/admin/Action',{Request_id,Date,STime,ETime,Action});
            if (res.data.Success){
                showtoast(Action === "Accepted" ? "Request Accepted" : "Request Rejected","green");
                fetchrequest();
            }else{
                showtoast("Slot Already Assigned","red");
                fetchrequest();
            }
        }catch(err){
            console.log(err.message);

        }
    }

    return (
        <>
        <Card className="no-hover mt-4 w-100" style={{ maxHeight: "60vh" }}>
            <Card.Header
                className="w-100 d-flex justify-content-between align-items-center sticky-top bg-white"
                style={{ zIndex: 1 }}
            >
                <h5 className="mb-0">Pending Approvals</h5>
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Search..."
                        className="me-2"
                    />
                    <Button size="sm" variant="outline-primary">
                        <i className="fas fa-filter me-1"></i> Filter
                    </Button>
                </div>
            </Card.Header>

            <Card.Body
                className="w-100"
                style={{ overflowY: "auto", maxHeight: "calc(70vh - 60px)" }}
            >
                <Table hover responsive>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Event Name</th>
                            <th>Requested By</th>
                            <th>Date & Time</th>
                            <th>View Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingreq.map((item) => (
                            <tr key={item.Request_id}>
                                <td>{"#" + item.Request_id}</td>
                                <td>{item.EventType}</td>
                                <td>{item.Club_Name}</td>
                                <td>
                                    {item.EventDate +
                                        " " +
                                        item.StartTime +
                                        "-" +
                                        item.EndTime}
                                </td>
                                <td>
                                    <Badge bg="warning" className="pe-3 ps-3" onClick={() => {setSelected(item)}}> View </Badge>
                                </td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="success"
                                        className="me-1"
                                        onClick={() => handleCheck(item.Request_id,item.EventDate,item.StartTime,item.EndTime,"Accepted")}
                                    >
                                        <i className="fas fa-check"></i>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleCheck(item.Request_id,item.EventDate,item.StartTime,item.EndTime,"Rejected")}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
        {selected && (
                <div className="selected-box" style={{zIndex:"10000"}}>
                    <div className="detail-Container pt-2 pb-2">
                        <h1 style={{ width: "100%", textAlign: "center" }}>Details</h1>

                        {/* MasterTable Data */}
                        <div className="detail-titl">
                            <p style={{ fontWeight: "600" }}>RequestID: {selected.Request_id}</p>
                            <p>User ID: {selected.user_id}</p>
                            <p>Date: {new Date(selected.EventDate).toLocaleDateString()}</p>
                            <p>Time: {selected.StartTime} - {selected.EndTime}</p>
                            <div className={`detail-stat grey`}>{selected.Status}</div>
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

                        <button className="detail-btn mt-0" onClick={() => setSelected(null)}>
                            Close
                        </button>
                    </div>
                </div>

            )}
        {toast && <Toastbox message={toast.message} color={toast.color} />}              
        </>
    );
}

export default PendingRequest;