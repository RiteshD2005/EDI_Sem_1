import React, { useState} from "react";
import {jwtDecode} from "jwt-decode";
import "./Stylesheets/Request.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Toast({ message, type }) {
    return <div className={`Messagetoast ${type}`}>{message}</div>;
}

function Sendreq() {
    const navigate = useNavigate();
    const getUserData = () => {
        const token = sessionStorage.getItem("token");
        if (!token) return {name: "", PRN: "" };

        try {
            const decoded = jwtDecode(token);
            console.log(decoded.id);
            return {
                id:decoded.id,
                name: decoded.name || "",
                PRN: decoded.PRN || "",
            };
        } catch (err) {
            console.error("Invalid token", err);
            return { name: "", PRN: "" };
        }
    };
    const userdata = getUserData();

    const initialFormData = {
        Fullname: userdata.name,
        PRN: userdata.PRN,
        user_id: userdata.id,
        position: "",
        ClubName: "",
        ClubNo: "",
        EventType: "",
        EventTitle: "",
        date: "",
        starttime: "",
        endtime: "",
        subject: "",
        description: "",
        GuestName: "",
        GuestDesignation: "",
        GuestContact: "",
        Income: parseInt(""),
        Expenditure: parseInt(""),
        SourceofFund: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null); // {message, type}
    const [errorMessage , setErrorMessage] = useState("");
    const [AfterContainer, setAfterContainer] = useState(false);
    const [otherEvent, setOtherEvent] = useState("");
    const [generatedID, setGeneratedID] = useState("");
    const [allcheck, setAllCheck] = useState({
        first: false,
        second: false,
        third: false,
    });

    const allchecked = Object.values(allcheck).every(Boolean);

    const handlecheckbox = (e) => {
        const { name, checked } = e.target;
        setAllCheck((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };


    const handlechange = (e) => {
        const { name, value } = e.target;

        if (name === "EventType") {
            if (value === "Other") {
                setFormData({ ...formData, EventType: "Other" });
            } else {
                setFormData({ ...formData, EventType: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleOtherChange = (e) => {
        const value = e.target.value;
        setOtherEvent(value);
        if (formData.EventType === "Other" || formData.EventType === "") {
            setFormData({ ...formData, EventType: value });
        }
    };

    const handlereset = () => {
        setFormData(initialFormData);
        setOtherEvent("");
        setAllCheck({ first: false, second: false, third: false });
    };

    const showtoast = (message, type = "success") => {
        setError({ message, type });
        setTimeout(() => setError(null), 3000);
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        console.log(formData);
        if(formData.starttime<"08:00" || formData.starttime>"18:00" || formData.endtime>"18:00" || formData.endtime<"08:00"){
            showtoast("Select Time b/w 8:00 - 18:00");
            return;
        }

        if(formData.starttime > formData.endtime){
            showtoast("Start Time cannot be After End Time", "failed");
            return;
        }

        try {
            const res = await axios.post(
                `http://localhost:5000/api/SendRequest`,
                { formData }
            );
            console.log(res);
            setAfterContainer(true);
            setGeneratedID(res.data.ReqID || "");
            setErrorMessage(res.data.message);
            showtoast(res.data.message, res.data.success);
        } catch (err) {
            console.error(err);
            setAfterContainer(true);
            setGeneratedID("");
            setErrorMessage(err.message)
            showtoast(err.message || "Failed to send Request", "failed");
        }
    };

    return (
        <>
            {AfterContainer ? (
                <div className="difbody">
                    <div className="MessageCont">
                        <h1>{errorMessage}</h1>
                        <p>
                            {generatedID === ""
                                ? ""
                                : `This is your Request ID:- ${generatedID}`}
                        </p>
                        <div className="buttons">
                            <button onClick={()=>{navigate("/HomePage") }}>Home</button>
                            <button onClick={() => setAfterContainer(false)}>
                                Send Another
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="hero-section">
                        <h1>Book Your Slot</h1>
                    </div>
                    <form onSubmit={handlesubmit}>
                        <div className="reqContainer">
                            <div className="Section-1">
                                <div className="line">
                                    <p>1</p>
                                    <hr
                                        style={{
                                            border: "1px solid black",
                                            width: "100%",
                                            height: "0.5px",
                                        }}
                                    />
                                </div>

                                <div className="cont-1">
                                    {/* Strip 1 */}
                                    <div className="strip1">
                                        <div className="item1">
                                            <label>Name:</label>
                                            <input type="text" placeholder={getUserData().name} disabled />
                                        </div>
                                        <div className="item2">
                                            <label>Club Name:</label>
                                            <input
                                                type="text"
                                                name="ClubName"
                                                placeholder="Enter Full Name"
                                                value={formData.ClubName}
                                                onChange={handlechange}
                                                required
                                            />
                                        </div>
                                        <div className="item3">
                                            <label>Club No:</label>
                                            <input
                                                type="number"
                                                name="ClubNo"
                                                value={formData.ClubNo}
                                                onChange={handlechange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Strip 2 */}
                                    <div className="strip2">
                                        <div className="item4">
                                            <label>Position:</label>
                                            <select
                                                name="position"
                                                value={formData.position}
                                                onChange={handlechange}
                                                required
                                            >
                                                <option value="">
                                                    Select Option
                                                </option>
                                                <option value="President">
                                                    President
                                                </option>
                                                <option value="Secratery">
                                                    Secretary
                                                </option>
                                                <option value="Coordinator">
                                                    Coordinator
                                                </option>
                                                <option value="Member">
                                                    Member
                                                </option>
                                                <option value="Volunter">
                                                    Volunteer
                                                </option>
                                            </select>
                                        </div>

                                        <div className="item5">
                                            <label>Event Title:</label>
                                            <input
                                                type="text"
                                                name="EventTitle"
                                                value={formData.EventTitle}
                                                onChange={handlechange}
                                                required
                                            />
                                        </div>

                                        <div className="item6">
                                            <label>Event Type:</label>
                                            <select
                                                name="EventType"
                                                value={
                                                    formData.EventType !==
                                                        otherEvent &&
                                                    formData.EventType !== ""
                                                        ? formData.EventType
                                                        : "Other"
                                                }
                                                onChange={handlechange}
                                            >
                                                <option value="">
                                                    Select Option
                                                </option>
                                                <option value="Workshop">
                                                    Workshop
                                                </option>
                                                <option value="Seminar">
                                                    Seminar
                                                </option>
                                                <option value="Competition">
                                                    Competition
                                                </option>
                                                <option value="Guest-Lecture">
                                                    Guest Lecture
                                                </option>
                                                <option value="Cultural">
                                                    Cultural
                                                </option>
                                                <option value="Other">
                                                    Other
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Strip 3 */}
                                    <div className="strip3">
                                        <div className="item7">
                                            <label>Other:</label>
                                            <input
                                                type="text"
                                                value={otherEvent}
                                                disabled={
                                                    formData.EventType !==
                                                        "Other" &&
                                                    formData.EventType !== ""
                                                }
                                                onChange={handleOtherChange}
                                                placeholder="Enter custom event type"
                                            />
                                        </div>

                                        <div className="item8">
                                            <label>Event Date:</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handlechange}
                                                min={new Date().toISOString().split("T")[0]}
                                                required
                                            />
                                        </div>

                                        <div className="item9">
                                            <label>Venue:</label>
                                            <input
                                                type="text"
                                                placeholder="Seminar Hall"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/* Strip 4 */}
                                    <div className="strip4">
                                        <div className="item10">
                                            <label>Start Time:</label>
                                            <input
                                                type="time"
                                                name="starttime"
                                                value={formData.starttime}
                                                onChange={handlechange}
                                                min="08:00"
                                                max="17:00"
                                                step="300"
                                                required
                                            />
                                        </div>

                                        <div className="item11">
                                            <label>End Time:</label>
                                            <input
                                                type="time"
                                                name="endtime"
                                                value={formData.endtime}
                                                onChange={handlechange}
                                                min={formData.starttime || "09:00"}
                                                max="18:00"
                                                step={300}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Subject + Description */}
                                    <div className="item12">
                                        <label>Subject:</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handlechange}
                                            required
                                        />
                                    </div>

                                    <div className="item13">
                                        <label>Description:</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handlechange}
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Line 2 */}
                                    <div className="line">
                                        <p>2</p>
                                        <hr
                                            style={{
                                                border: "1px solid black",
                                                width: "100%",
                                                height: "0.5px",
                                            }}
                                        />
                                    </div>

                                    {/* Guest Info */}
                                    <div className="strip5">
                                        <div className="item14">
                                            <label>Guest Name (If Present):</label>
                                            <input
                                                type="text"
                                                name="GuestName"
                                                value={formData.GuestName}
                                                onChange={handlechange}
                                            />
                                        </div>
                                        <div className="item15">
                                            <label>
                                                Guest Designation/Organisation:
                                            </label>
                                            <input
                                                type="text"
                                                name="GuestDesignation"
                                                value={formData.GuestDesignation}
                                                onChange={handlechange}
                                            />
                                        </div>
                                        <div className="item16">
                                            <label>Guest Contact Info:</label>
                                            <input
                                                type="number"
                                                name="GuestContact"
                                                value={formData.GuestContact}
                                                onChange={handlechange}
                                            />
                                        </div>
                                    </div>

                                    {/* Budget */}
                                    <div className="strip6">
                                        <label>Estimated Budget:</label>
                                        <div className="item17">
                                            <label>Income (Rs.):</label>
                                            <input
                                                type="number"
                                                name="Income"
                                                value={formData.Income}
                                                onChange={handlechange}
                                                required
                                            />
                                        </div>
                                        <div className="item18">
                                            <label>Expenditure (Rs.):</label>
                                            <input
                                                type="number"
                                                name="Expenditure"
                                                value={formData.Expenditure}
                                                onChange={handlechange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="item19">
                                        <label>Source of funds:</label>
                                        <input
                                            type="text"
                                            name="SourceofFund"
                                            value={formData.SourceofFund}
                                            onChange={handlechange}
                                        />
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="checkdiv">
                                        <input
                                            name="first"
                                            type="checkbox"
                                            checked={allcheck.first}
                                            onChange={handlecheckbox}
                                        />
                                        <label>
                                            The event will not promote any
                                            religion, caste, political ideology,
                                            or irrelevant agenda.
                                        </label>
                                        <br />

                                        <input
                                            name="second"
                                            type="checkbox"
                                            checked={allcheck.second}
                                            onChange={handlecheckbox}
                                        />
                                        <label>
                                            The activity is intended solely for
                                            the benefit of students and the
                                            institute.
                                        </label>
                                        <br />

                                        <input
                                            name="third"
                                            type="checkbox"
                                            checked={allcheck.third}
                                            onChange={handlecheckbox}
                                        />
                                        <label>
                                            All approvals will be obtained prior
                                            to the event, and accounts will be
                                            settled within 15 days post-event.
                                        </label>
                                        <br />
                                    </div>

                                    {/* Buttons */}
                                    <div className="buttons">
                                        <button
                                            type="reset"
                                            onClick={handlereset}
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!allchecked}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </>
            )}
            {error && <Toast message={error.message} type={error.type} />}
        </>
    );
}

export default Sendreq;