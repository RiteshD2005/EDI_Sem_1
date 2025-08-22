import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleAdminLogin = async () => {
        if (!email || !password) {
            alert("All fields are required!");
            return;
        }

        try {
            const res = await axios.post("https://localhost:5000/api/admin/login", { email, password });

            if (res.data.success) {
                localStorage.setItem("adminToken", res.data.token);
                alert("Admin login successful");
                navigate("/admin-dashboard");
            } else {
                alert("Login failed: " + res.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Admin Login</h2>
                <label>Email: </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password: </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleAdminLogin}>LOGIN</button>
            </div>
        </div>
    );
}

export default AdminLogin;
