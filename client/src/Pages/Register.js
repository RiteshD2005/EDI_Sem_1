import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import './Stylesheets/Login_Register.css';

function Register() {
    const navigate = useNavigate();
    const [Fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [PRN, setPRN] = useState("");
    const [branch, setBranch] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [color, setColor] = useState("red");
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
                setColor('green');
                navigate('/');
            } else {
                setMessage("Registration failed: " + res.data.message);
            }
        } catch (err) {
            if (err.response) {
                setMessage("Registration failed: " + err.response.data.message);
            } else {
                setMessage("Something went wrong. Please try again later.");
            }
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

                <div className="Messagebox" style={{ color: `${color}`, textAlign: 'center' }}>{message}</div>

                <button onClick={handleRegister}>REGISTER</button>
                <h5>Already have an account? <Link to="/">Login</Link></h5>
            </div>
        </div>
    );
}

export default Register;
