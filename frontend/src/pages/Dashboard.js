// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import api from '../api/axiosConfig';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // fetch user’s upcoming bookings
  useEffect(() => {
    api.get('bookings/?user_self=1')   // your endpoint that returns only this user’s bookings
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error(err);
        setError('Unable to load your bookings.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (id) => {
    api.delete(`bookings/${id}/`)
      .then(() => {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      })
      .catch(() => alert('Unable to cancel—please try again.'));
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <CustomBreadcrumb activeLabel="Dashboard" />

      <Container style={{ marginTop: '80px', marginBottom: '2rem' }}>
        <h1 className="mb-4">My Upcoming Bookings</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        {bookings.length === 0 ? (
          <Alert variant="info">You have no upcoming bookings.</Alert>
        ) : (
          <Card className="shadow-sm">
            <Card.Body>
              <ListGroup variant="flush">
                {bookings.map((bk) => (
                  <ListGroup.Item
                    key={bk.id}
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div>
                      <div className="fw-bold">{bk.yoga_class.title}</div>
                      <div>
                        {new Date(bk.yoga_class.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                        ,&nbsp;
                        {bk.yoga_class.start_time} ({bk.yoga_class.duration} mins)
                      </div>
                      <div className="text-muted">
                        Instructor: {bk.yoga_class.instructor_name}
                      </div>
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
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
