import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Stylesheets/Login_Register.css";

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
        if (!Fullname || !email || !PRN || !branch || !password) {
            setMessage("All fields are required!");
            return;
        }

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
                setColor("green");
                alert("Registered Successfully");
                navigate("/");
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
        <div className="login-wrapper">  
            <div className="login-card">

                <h2 className="login-title">Create Account</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={Fullname}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email (@vit.edu)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="PRN"
                    value={PRN}
                    onChange={(e) => setPRN(e.target.value)}
                />

                <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="glass-select"
                >
                    <option value="">Select Branch</option>
                    <option value="CE-Software_Engineering">CE - Software Engineering</option>
                    <option value="CE-Data_Science">CS - Data Science</option>
                    <option value="CE-IOT">CS - IoT</option>
                    <option value="IT">IT</option>
                    <option value="ENTC">ENTC</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil_Engineering">Civil Engineering</option>
                </select>

                <input
                    type="password"
                    placeholder="Set Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="Messagebox" style={{ color: color }}>
                    {message}
                </div>

                <button onClick={handleRegister}>Register</button>

                <div className="login-extra">
                    Already have an account? <Link to="/">Login</Link>
                </div>

            </div>
        </div>
    );
}

export default Register;
