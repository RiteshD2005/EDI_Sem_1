import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { Card, Nav,Table } from "react-bootstrap";

function BookedPanel({ date }) {
  const [slots, setSlots] = useState([]);
  const [activeTab, setActiveTab] = useState("today");

  const fetchTodaySlots = useCallback(async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/todayslot");
      setSlots(res.data);
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const fetchUpcomingSlots = useCallback(async () => {
    try {
      if (!date) return;
      const formatted = date.toLocaleDateString("en-CA"); // YYYY-MM-DD in local timezone
      console.log(formatted);
      const res = await axios.post("http://localhost:5000/api/admin/upcomingslot", { formatted });
      setSlots(res.data);
      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  }, [date]);

  useEffect(() => {
    if (activeTab === "today") {
      fetchTodaySlots();
    } else if (activeTab === "upcoming") {
      fetchUpcomingSlots();
    }
  }, [activeTab, fetchTodaySlots, fetchUpcomingSlots]); // re-run when tab or date changes

  return (
    <Card className="no-hover mt-4 w-100 shadow-sm" style={{ maxHeight: "60vh", minHeight: "20vh" }}>
      <Card.Header className="w-100 bg-light text-white d-flex justify-content-between align-items-center">
        <Nav variant="pills" activeKey={activeTab} className="flex-grow-1">
          <Nav.Item>
            <Nav.Link  eventKey="today" onClick={() => setActiveTab("today")}>
              Today's Event
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link  eventKey="upcoming" onClick={() => setActiveTab("upcoming")}>
              Upcoming Slots
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>

      <Card.Body className="w-100 overflow-auto">
        {slots.length === 0 ? (
          <div className="text-center text-muted py-4">
            <i className="fas fa-calendar-times fa-2x mb-2"></i>
            <p className="mb-0">No Slot Booked For the Day</p>
          </div>
        ) : (
          <Table hover responsive bordered className="align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>S.No.</th>
                <th>Request ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Event Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, index) => (
                <tr key={slot.Request_id}>
                  <td className="fw-bold">{index + 1}</td>
                  <td>{"#" + slot.Request_id || "-"}</td>
                  <td>{slot.EventDate || "-"}</td>
                  <td>
                    <span className="badge bg-info text-dark px-3 py-2">
                      {slot.StartTime} - {slot.EndTime}
                    </span>
                  </td>
                  <td>{slot.EventType || "-"}</td>
                  <td>
                    <span className="badge bg-success px-3 py-2">Booked</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>

  );
}

export default BookedPanel;