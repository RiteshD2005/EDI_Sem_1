import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import './Login_Register.css';

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
                setMessage("");
                localStorage.setItem("token", res.data.token);
                setMessage("Login successful");
                navigate("/RequestPage");
            } else {
                setMessage("Login failed: " + res.data.message);
            }
        } catch (err) {
            console.log(err);
            setMessage("Unable to connect. Try again later.")
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>LOGIN</h2>
                <label>Email: </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password: </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                <div className="Messagebox">{Message}</div>
                <button onClick={handleLogin}>LOGIN</button>
                <h5>dont have a account?<Link to="/register" >Register</Link></h5>
            </div>
        </div>
    );

}
export default Login;