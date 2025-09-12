import React, { useState, useEffect } from "react";
import "./Admincss/Admin.css";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Row,
  Col,
  Card,
  Button,
  Form
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import CalendarView from "./Calender";
import PendingRequest from "./Pending_request";
import BookedPanel from "./BookedPanel";
import axios from "axios";
import profilelogo from '../Components/profile.png';
import "./Admincss/Toast.css";

// Reusable Stat Card
const StatCard = ({ number, title }) => (
  <Card className="stat-card me-5 ms-5 w-100 h-100">
    <Card.Body>
      <div className="stat-number">{number}</div>
      <div className="stat-title">{title}</div>
    </Card.Body>
  </Card>
);

// Reusable Quick Action Button
const QuickAction = ({ icon, label, onClick }) => (
  <Button variant="outline-primary" className="text-start" onClick={onClick}>
    <i className={`fas ${icon} me-2`} />
    {label}
  </Button>
);



function Toastbox({ message, color }) {
  return <div className={`Toast ${color}`}>{message}</div>;
}

const AdminDashboard = () => {
  const [selectDate, setSelectDate] = useState(null);
  const [Count, setCount] = useState([0, 0, 1]);
  const [task, setTask] = useState(true);
  const [toast, setToast] = useState(null);

  const showtoast = (message, color = 'red') => {
    setToast({ message, color });
    setTimeout(() => setToast(null), 3000);
  }

  const navigate = useNavigate();

  const handleSubmit = async (FullName, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/registration', { FullName, email, password });
      showtoast(res.data.message, res.data.color);
    } catch (err) {
      console.log(err.message);
      showtoast("Unable to connect to database");
    }
  }

  const quickActions = [
    { icon: "fa-file-pdf", label: "Generate Report", action: () => { } },
    { icon: "fa-user-plus", label: "Add Admin", action: () => { setTask(false) } },
    { icon: "fa-cog", label: "System Settings", action: () => { } },
    { icon: "fa-user", label: "Logout", action: () => logout() },
  ];

  // ⬇️ Run statcount when component mounts
  const statcount = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/Counts");
      console.log(res.data);
      setCount(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    statcount();
  }, []);

  const logout = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div>
      {/* Navbar */}
      <Navbar expand="lg" bg="light" className="px-4 fixed-top">
        <Container fluid>
          <Navbar.Brand href="#">
            <i className="fas fa-chalkboard-teacher me-2"></i>
            Seminar Hall Booking System
          </Navbar.Brand>
          <Nav className="ms-auto h-100">
            <NavDropdown
              align="end"
              id="dropdownUser"
              title={
                <span className="d-flex align-items-center">
                  <img
                    src={profilelogo}
                    alt=""
                    width="40"
                    height="40"
                    className="rounded-circle me-2"
                  />
                  Admin
                </span>
              }
            >
              <NavDropdown.Item href="#">
                <i className="fas fa-user me-2"></i> Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => logout()}>
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="pt-5">
        <Row>
          {/* Sidebar */}
          <Col md={2} className="sidebar d-none d-md-block">
            <Nav className="flex-column">
              <Nav.Link className={(task) ? "active" : ""} onClick={() => setTask(true)}>
                <i className="fas fa-tachometer-alt me-2" ></i> Dashboard
              </Nav.Link>
              <Nav.Link className={(task) ? "" : "active"} onClick={() => setTask(false)}><i className="fas fa-users me-2"></i> Add Admin </Nav.Link>
              <Nav.Link onClick={() => logout()}><i className="fas fa-chart-bar me-2" ></i> Logout </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={10} className="main-content">
            {(task) ? (
              <>
                <div className="dashboard-header d-flex justify-content-between align-items-center my-3">
                  <h2>Admin Dashboard</h2>
                  <div className="d-flex">
                    <Button variant="outline-primary" className="me-3 position-relative" onClick={() => {showtoast("Comming Soon","green")}}>
                      <i className="fas fa-bell"></i>
                      <span className="notification-badge">0</span>
                    </Button>
                    <Button variant="primary" onClick={() => {showtoast("Comming Soon","green")}}>
                      <i className="fas fa-plus me-2"></i> New Booking
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <Row>
                  <Col md={4} className="d-flex justify-content-center align-items-center"><StatCard number={Count[0]} title="Today's Bookings" /></Col>
                  <Col md={4} className="d-flex justify-content-center align-items-center"><StatCard number={Count[1]} title="Pending Requests" /></Col>
                  <Col md={4} className="d-flex justify-content-center align-items-center"><StatCard number={Count[2]} title="Available Halls" /></Col>
                </Row>

                {/* Booking Tabs */}
                <BookedPanel date={selectDate} />

                {/* Calendar + Side Panel */}
                <Row className="mt-4">
                  {/* Calendar */}
                  <Col md={8}>
                    <CalendarView
                      selectedDate={selectDate}
                      onDateSelect={(date) => setSelectDate(date)}
                    />
                  </Col>

                  {/* Right Side */}
                  <Col md={4}>
                    <Card className="no-hover w-100 quick-box">
                      <Card.Header className="w-100"><h5 className="mb-0">Quick Actions</h5></Card.Header>
                      <Card.Body className="w-100">
                        <div className="d-grid gap-2">
                          {quickActions.map((action, idx) => (
                            <QuickAction key={idx} icon={action.icon} label={action.label} onClick={action.action} />
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Pending Approvals */}
                <PendingRequest />
                {toast && <Toastbox message={toast.message} color={toast.color} />}
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center my-3 w-100" style={{ height: "100vh" }}>
                <Card className="shadow-lg p-4" style={{ minWidth: "350px", maxWidth: "500px", width: "100%" }}>
                  <Card.Header className="bg-primary text-white text-center">
                    <h3 className="mb-0">Add Admin</h3>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={(e) => {
                      e.preventDefault(); // stop refresh
                      const FullName = e.target.formName.value;
                      const email = e.target.formEmail.value;
                      const password = e.target.formPassword.value;
                      handleSubmit(FullName, email, password);
                    }}>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter admin name" />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" />
                      </Form.Group>

                      <div className="d-flex justify-content-center">
                        <Button variant="primary" type="submit" className="px-4">
                          Add Admin
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
                {toast && <Toastbox message={toast.message} color={toast.color} />}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
