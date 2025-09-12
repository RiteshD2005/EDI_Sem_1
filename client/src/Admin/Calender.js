import React, { useState } from "react";
import { Card, Button, Table } from "react-bootstrap";

const CalendarView = ({ selectedDate, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const daysInMonth = [];
  let day = 1;
  for (let i = 0; i < 6; i++) {
    let week = [];
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDay.getDay()) || day > lastDay.getDate()) {
        week.push(null);
      } else {
        week.push(day);
        day++;
      }
    }
    daysInMonth.push(week);
  }

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const handleDateClick = (day) => {
    if (day) {
      const clickedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      onDateSelect(clickedDate); // send to parent
    }
  };

  return (
    <Card className="no-hover w-100">
      <Card.Header className="w-100">
        <h5 className="mb-0">Calendar View</h5>
      </Card.Header>
      <Card.Body className="w-100">
        <div className="d-flex justify-content-between mb-3 w-100">
          <Button size="sm" variant="outline-primary" onClick={() => changeMonth(-1)}>
            <i className="fas fa-chevron-left"></i>
          </Button>
          <h5 className="text-center">{monthYear}</h5>
          <Button size="sm" variant="outline-primary" onClick={() => changeMonth(1)}>
            <i className="fas fa-chevron-right"></i>
          </Button>
        </div>

        <Table bordered>
          <thead>
            <tr>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>
            {daysInMonth.map((week, i) => (
              <tr key={i}>
                {week.map((day, j) => (
                  <td
                    key={j}
                    onClick={() => handleDateClick(day)}
                    style={{
                      cursor: day ? "pointer" : "default",
                      backgroundColor:
                        selectedDate &&
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === currentDate.getMonth()
                          ? "#3498db"
                          : "transparent",
                      color:
                        selectedDate &&
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === currentDate.getMonth()
                          ? "white"
                          : "black",
                    }}
                  >
                    {day || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="w-100 d-flex justify-content-between">
          <strong>
            Selected Date:{" "}
            {selectedDate ? selectedDate.toLocaleDateString("en-GB") : "None"}
          </strong>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CalendarView;
