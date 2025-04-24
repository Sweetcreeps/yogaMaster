// src/pages/Dashboard.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Alert } from 'react-bootstrap';
import CustomBreadcrumb from '../components/CustomBreadcrumb';

const Dashboard = () => {
  // Mock membership info
  const [membership] = useState({
    plan: 'Monthly Subscription',
    startDate: 'April 1, 2025',
    expiryDate: 'April 30, 2025',
  });

  // Mock upcoming bookings
  const [bookings, setBookings] = useState([
    {
      id: 1,
      title: 'Vinyasa Flow',
      when: 'Today • 6:00 AM (60 mins)',
      instructor: 'Alice',
    },
    {
      id: 2,
      title: 'Hatha Yoga',
      when: 'Tomorrow • 8:00 AM (75 mins)',
      instructor: 'Bob',
    },
    {
      id: 3,
      title: 'Yin Yoga',
      when: 'April 23, 2025 • 10:00 AM (50 mins)',
      instructor: 'Clara',
    },
  ]);

  const handleCancel = (id) => {
    // remove booking from list
    setBookings((b) => b.filter((bk) => bk.id !== id));
    alert('Your booking has been cancelled.');
  };

  return (
    <>
      
      <CustomBreadcrumb activeLabel="Dashboard" />

      <Container style={{ marginTop: '80px', marginBottom: '2rem' }}>
        <h1 className="mb-4">My Dashboard</h1>
        <Row className="gy-4">
          {/* Membership Card */}
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>Membership</Card.Title>
                <Card.Text>
                  <strong>Plan:</strong> {membership.plan}<br/>
                  <strong>Started:</strong> {membership.startDate}<br/>
                  <strong>Expires:</strong> {membership.expiryDate}
                </Card.Text>
                <Button variant="outline-primary" className="mt-auto">
                  Manage Membership
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Upcoming Bookings */}
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Upcoming Bookings</Card.Title>
                {bookings.length === 0 ? (
                  <Alert variant="info">You have no upcoming bookings.</Alert>
                ) : (
                  <ListGroup variant="flush">
                    {bookings.map((bk) => (
                      <ListGroup.Item key={bk.id} className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold">{bk.title}</div>
                          <div>{bk.when}</div>
                          <div className="text-muted">Instructor: {bk.instructor}</div>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleCancel(bk.id)}
                        >
                          Cancel
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      
    </>
  );
};

export default Dashboard;
