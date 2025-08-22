import { useState } from "react";
import axios from "axios";
import { Link ,Navigate } from 'react-router-dom';
import './Login_Register.css';


function Register() {
    const [Fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [PRN, setPRN] = useState("");
    const [branch, setBranch] = useState("");
    const [password, setPassword] = useState("");
    const [message , setMessage] = useState("");
    const handleRegister = async () => {
    // Basic validation
    if (!Fullname || !email || !PRN || !branch || !password) {
        setMessage("All fields are required!");
        return;
    }

    // Optional: email format check
    if (!email.endsWith("@vit.edu")) {
        setMessage("Email must end with @vit.edu");
        return;
    }

    try {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
            Fullname,
            email,
            PRN,
            branch,
            password
        });

        if (res.data.success) {
            alert("Registered Successfully");
            Navigate('./RequestPage');
        } else {
            setMessage("Registration failed: " + res.data.message);
        }
    } catch (err) {
        console.error(err);
        setMessage("Something went wrong. Please try again later.");
    }
};


    return (
        <div className="register-container">
            <div className="register-form">
                <h2>Register</h2>

                <label>Full Name:</label>
                <input
                    type="text"
                    value={Fullname}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    placeholder="@vit.edu"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>PRN:</label>
                <input
                    type="number"
                    value={PRN}
                    onChange={(e) => setPRN(e.target.value)}
                />

                <div className="branch-selection">
                    <label>Branch:</label>
                    <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                        <option value="">Select Branch</option>
                        <option value="CE-Software_Engineering">CE-Software Engineering</option>
                        <option value="CE-Data_Science">CS - Data Science</option>
                        <option value="CE-IOT">CS-IOT</option>
                        <option value="IT">IT</option>
                        <option value="ENTC">ENTC</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil_Engineering">Civil Engineering</option>
                    </select>
                </div>

                <label>Set Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="Messagebox" style={{color:'red', alignSelf:'center'}}>{message}</div>

                <button onClick={handleRegister}>REGISTER</button>
                <h5>Already have an account? <Link to="/">Login</Link></h5>
            </div>
        </div>
    );
}

export default Register;
