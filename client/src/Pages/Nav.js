import React, {useState} from "react";
import "./dashboard.css";
import { Link } from 'react-router-dom';

function Navbar(){
    const [menuOpen , setMenuOpen] = useState(false);

    return(
        <div className="Nav">
            <h1>Dashboard</h1>

            <button className="menu-toggle" onClick={()=> setMenuOpen(!menuOpen)}>
                ☰
            </button>

            <div className={`links ${menuOpen ? "show" : ""}`}>
                <h3>Occupied Slot</h3>
                <Link to="/RequestPage" style={{textDecoration:"none",color:"inherit"}}><h3>Request</h3></Link>
                <h3>Profile</h3>    
            </div>
        </div>
    )

}

export default Navbar;