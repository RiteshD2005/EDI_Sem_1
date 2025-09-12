import React, {useState} from "react";
import "./Stylesheets/Nav.css";
import { Link , useNavigate } from 'react-router-dom';

function Navbar(){
    const [menuOpen , setMenuOpen] = useState(false);
    const navigate = useNavigate();

    return(
        <div className="Nav">
            <h1 onClick={() => navigate("/HomePage")}>Dashboard</h1>

            <button className="menu-toggle" onClick={()=> setMenuOpen(!menuOpen)}>
                ☰
            </button>

            <div className={`links ${menuOpen ? "show" : ""}`}>
                <Link to="/Slot_pg" className="nav-link" onClick={() => setMenuOpen(false)}>Occupied Slot</Link>
                <Link to="/RequestPage" className="nav-link" onClick={() =>setMenuOpen(false)}>Request</Link>
                <Link to="/HistoryPg" className="nav-link" onClick={() => setMenuOpen(false)}>History</Link>
                <Link to="/HomePage" className="nav-link">Profile</Link>
            </div>
        </div>
    )
}
export default Navbar;