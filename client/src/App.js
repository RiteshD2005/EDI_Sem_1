import React from 'react';
import Login from './Pages/Login.js';
import Register from './Pages/Register.js';
import AdminDashboard from './Admin/AdminDashboard.js';
import Sendreq from './Pages/SendReq.js';
import SlotPg from './Pages/SlotPage.js';
import History from './Pages/History.js';
import Navbar from './Pages/Nav.js';
import HomePage from './Pages/HomePage.js';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


// Private route for user
function PrivateUserRoute({ children }) {
  const token = sessionStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

// Private route for admin
function PrivateAdminRoute({ children }) {
  const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/" />; // go back to login if no token

  try {
    const decoded = jwtDecode(token);
    return decoded.role === "admin" ? children : <Navigate to="/" />;
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/" />;
  }
}


// Wrapper for showing Navbar only on allowed pages
function Layout({ children }) {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/register", "/admin-dashboard"];

  return (
    <div>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public user routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected user routes */}
          <Route
            path="/HomePage"
            element={
              <PrivateUserRoute>
                <HomePage />
              </PrivateUserRoute>
            }
          />
          <Route
            path="/RequestPage"
            element={
              <PrivateUserRoute>
                <Sendreq />
              </PrivateUserRoute>
            }
          />
          <Route
            path="/Slot_pg"
            element={
              <PrivateUserRoute>
                <SlotPg />
              </PrivateUserRoute>
            }
          />
          <Route
            path="/HistoryPg"
            element={
              <PrivateUserRoute>
                <History />
              </PrivateUserRoute>
            }
          />

          {/* Admin routes */}
          {/* <Route path="/admin-login" element={<AdminLogin />} /> */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
