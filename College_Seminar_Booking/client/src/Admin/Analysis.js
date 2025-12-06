import React, { useState, useEffect } from "react";
import StatCard from './StatCard';
import { Card, Button, Col, Row, Form, Tab, Tabs } from "react-bootstrap";
import "./Admincss/Analysis.css";

import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from "axios";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

const dummyLineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Total Bookings',
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            tension: 0.1
        },
        {
            label: 'Pending Requests',
            data: [28, 48, 40, 19, 86, 27, 90],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1
        },
    ],
};

const dummyBarData = {
    labels: ['Computer', 'Mechanical', 'ENTC', 'Civil', 'IT'],
    datasets: [
        {
            label: 'Bookings',
            data: [120, 85, 60, 40, 75],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ],
};

const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false, // We don't need a legend for one dataset
        },
        title: {
            display: false, // We use the Card.Title
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'No. of Bookings'
            }
        }
    }
};

const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
        },
    },
};

// Dummy data for Event Types (Pie)
const dummyPieData_EventTypes = {
    labels: ['Workshop', 'Seminar', 'Guest Lecture', 'Meeting'],
    datasets: [
        {
            label: '# of Bookings',
            data: [44, 35, 15, 6],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

// Dummy data for Bookings by Club (Pie)
const dummyPieData_Clubs = {
    labels: ['Robotics Club', 'Coding Club', 'Arts Circle', 'Debate Club'],
    datasets: [
        {
            label: '# of Bookings',
            data: [30, 45, 10, 15],
            backgroundColor: [
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
            ],
            borderColor: [
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

// Dummy data for Booking Status (Donut)
const dummyDoughnutData_Status = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
        {
            label: '# of Bookings',
            data: [120, 15, 5],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

function ReportUi() {

    const [lineChartData, setLineChartData] = useState(dummyLineData);
    const [StatCount, setStatCount] = useState([]);
    const [barChartData, setBarChartData] = useState(dummyBarData);
    const [eventTypeData, setEventTypeData] = useState(dummyPieData_EventTypes);
    const [clubData, setClubData] = useState(dummyPieData_Clubs);
    const [statusData, setStatusData] = useState(dummyDoughnutData_Status);

    const statcount = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/admin/reportstat");
            setStatCount(res.data);
            console.log(res.data);
            console.log("State total");
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        statcount();
    }, []);

    return (
        <>
            <div className="reports-container p-4" style={{ backgroundColor: '#f9fbfd' }}>

                {/* 1. Page Header & Date Range Filter */}
                <Row className="align-items-center mb-3">
                    <Col md={6}>
                        <h2 className="mb-0">Reports & Analysis</h2>
                        <p className="text-muted">View key metrics and booking trends.</p>
                    </Col>
                    <Col md={6} className="d-flex justify-content-end">
                        <Form.Group className="d-flex align-items-center">
                            <Form.Label className="me-2 mb-0" style={{ whiteSpace: 'nowrap' }}>
                                Date Range:
                            </Form.Label>
                            {/* Replace with <DatePicker /> component */}
                            <Form.Control type="text" placeholder="Select date range" style={{ width: '250px' }} />
                        </Form.Group>
                    </Col>
                </Row>

                {/* 2. KPI (Key Performance Indicators) Row */}
                <Row className="mb-4">
                    <Col md={3} className="d-flex">
                        {/* Re-using your StatCard component. The 'd-flex' ensures they stretch. */}
                        <StatCard number={StatCount.Total} title="Total Requests" />
                    </Col>
                    <Col md={3} className="d-flex">
                        <StatCard number={StatCount.pending} title="Pending Requests" />
                    </Col>
                    <Col md={3} className="d-flex">
                        <StatCard number={StatCount.userCount} title="Total Users" />
                    </Col>
                    <Col md={3} className="d-flex">
                        <StatCard number={StatCount.Buget} title="Total Event Budget" />
                    </Col>
                </Row>

                {/* 3. Main Content (Filters & Charts) */}
                <Card className="shadow-sm border-0">
                    <Card.Header className="bg-white p-0 border-0">
                        {/* Use Tabs for a clean filter interface */}
                        <Tabs defaultActiveKey="main" id="report-tabs" className="nav-tabs-custom">
                            <Tab eventKey="main" title={<span><i className="fas fa-chart-line me-2"></i> Main Reports</span>}>

                                <Row className="p-3">
                                    {/* Primary Charts */}
                                    <Col md={8} className="mb-4">
                                        <Card className="h-100 shadow-sm border-light">
                                            <Card.Body>
                                                <h5 className="card-title">Bookings Over Time</h5>

                                                <div style={{ height: '300px' }}>
                                                    <Line options={lineChartOptions} data={lineChartData} />
                                                </div>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 shadow-sm border-light">
                                            <Card.Body>
                                                <h5 className="card-title">Bookings by Branch</h5>

                                                {/* --- THIS IS THE MODIFIED PART --- */}
                                                <div style={{ height: '300px' }}>
                                                    <Bar options={barChartOptions} data={barChartData} />
                                                </div>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* Secondary Charts */}
                                <Row className="p-3 pt-0">
                                    {/* Secondary Charts */}
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 shadow-sm border-light">
                                            <Card.Body>
                                                <h5 className="card-title">Event Types</h5>

                                                {/* --- CHART 1 --- */}
                                                <div style={{ height: '300px' }}>
                                                    <Pie options={pieChartOptions} data={eventTypeData} />
                                                </div>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 shadow-sm border-light">
                                            <Card.Body>
                                                <h5 className="card-title">Bookings by Club</h5>

                                                {/* --- CHART 2 --- */}
                                                <div style={{ height: '300px' }}>
                                                    <Pie options={pieChartOptions} data={clubData} />
                                                </div>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4} className="mb-4">
                                        <Card className="h-100 shadow-sm border-light">
                                            <Card.Body>
                                                <h5 className="card-title">Booking Status</h5>

                                                {/* --- CHART 3 --- */}
                                                <div style={{ height: '300px' }}>
                                                    <Doughnut options={pieChartOptions} data={statusData} />
                                                </div>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Card.Header>
                </Card>
            </div>
        </>
    )
}

export default ReportUi;