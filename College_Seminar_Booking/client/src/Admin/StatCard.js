import React from 'react';
import { Card } from 'react-bootstrap';

// Make sure your StatCard CSS is available or define styles here
// Example: import './Admincss/Admin.css';

const StatCard = ({ number, title }) => (
  <Card className="stat-card w-100 h-100">
    <Card.Body>
      <div className="stat-number">{number}</div>
      <div className="stat-title">{title}</div>
    </Card.Body>
  </Card>
);

export default StatCard;