import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Stylesheets/Login_Register.css";
import { jwtDecode } from "jwt-decode";

function getrole() {
    const account = sessionStorage.getItem("token");
    let role = null;

    try {
        const decoded = jwtDecode(account);
        role = decoded.role;
        return role;
    } catch (err) {
        console.log(err.message);
        return "Something went wrong";
    }
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email.endsWith("@vit.edu") || !password) {
            setMessage("Recheck your credentials!");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

            if (res.data.success) {
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("user", res.data.user);
                setMessage("");

                const account = getrole();
                if (account === "admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/HomePage");
                }

            } else {
                setMessage("Login failed: " + res.data.message);
            }

        } catch (err) {
            console.log(err);
            setMessage("Unable to connect. Try again later.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">

                <h2 className="login-title">Welcome Back</h2>

                <input
                    type="email"
                    placeholder="Enter VIT Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="Messagebox">{Message}</div>

                <button onClick={handleLogin}>Login</button>

                <div className="login-extra">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>

            </div>
        </div>
    );
}

export default Login;
