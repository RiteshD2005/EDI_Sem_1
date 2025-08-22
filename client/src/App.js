import React from 'react';
import Login from './Pages/Login.js';
import Register from './Pages/Register.js';
import AdminLogin from './Admin/AdminLogin.js';
import AdminDashboard from './Admin/AdminDashboard.js';
import Sendreq from './Pages/SendReq.js'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Private route for admin dashboard
function PrivateAdminRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  return adminToken ? children : <Navigate to="/admin-login" />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* User routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/RequestPage' element={<Sendreq />} />

          {/* Admin routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
