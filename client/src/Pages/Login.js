import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import './Stylesheets/Login_Register.css';
// import Navbar from "./Nav";
import { jwtDecode } from "jwt-decode";

function getrole() {
    const account = sessionStorage.getItem("token");
    let role = null;

    try{
        const decoded = jwtDecode(account);
        role = decoded.role;
        return role;
    }catch(err){
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
                setMessage("");
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("user", res.data.user);
                setMessage("Login successfull");
                const accont = getrole();
                if(accont === 'admin'){
                    navigate("/admin-dashboard");
                }else{
                    navigate("/HomePage");
                }
            } else {
                setMessage("Login failed: " + res.data.message);
            }
        } catch (err) {
            console.log(err);
            setMessage("Unable to connect. Try again later.")
        }
    };

    return (
        <>
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
                    <div>
                    </div>
                    <button onClick={handleLogin}>LOGIN</button>
                    <h5>dont have a account?<Link to="/register">Register</Link></h5>
                </div>
            </div>
        </>
    );
}
export default Login;