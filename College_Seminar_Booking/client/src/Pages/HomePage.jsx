import React from "react";
import "./Stylesheets/HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.clear();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <>
            <div className="Banner">
                Welcome to Seminar Hall Booking System
                <p>At your fingertips</p>
            </div>

            <div className="Control-panel">
                <div className="Hcard" onClick={() => navigate("/RequestPage")}>
                    Book Your Slot
                </div>

                <div className="Hcard" onClick={() => navigate("/Slot_pg")}>
                    Check Available Slots
                </div>

                <div className="Hcard" onClick={() => navigate("/HistoryPg")}>
                    My History
                </div>

                <div className="Hcard" onClick={logout}>
                    Logout
                </div>
            </div>
        </>
    );
}

export default HomePage;