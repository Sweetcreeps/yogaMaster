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
  // holds the list of upcoming bookings for the logged-in user
  const [bookings, setBookings] = useState([]);
  // loading flag while we fetch data
  const [loading, setLoading] = useState(true);
  // if something goes wrong, show this message
  const [error, setError] = useState('');

  // on component mount, fetch only this user’s bookings
  useEffect(() => {
    api
      .get('bookings/?user_self=1') // assume backend filters by ?user_self=1
      .then((res) => {
        setBookings(res.data);      // save bookings in state
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load your bookings.'); // show user-friendly error
      })
      .finally(() => {
        setLoading(false);          // hide spinner in either case
      });
  }, []);

  // cancel a booking and remove it from UI
  const handleCancel = (id) => {
    api
      .delete(`bookings/${id}/`)
      .then(() => {
        // filter out cancelled booking
        setBookings((prev) => prev.filter((b) => b.id !== id));
      })
      .catch(() => {
        alert('Unable to cancel—please try again.');
      });
  };

  // if still waiting on data, show spinner
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      {/* breadcrumb for navigation context */}
      <CustomBreadcrumb activeLabel="Dashboard" />

      <Container style={{ marginTop: '80px', marginBottom: '2rem' }}>
        <h1 className="mb-4">My Upcoming Bookings</h1>

        {/* show any fetch error */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* if no bookings, let them know */}
        {bookings.length === 0 ? (
          <Alert variant="info">You have no upcoming bookings.</Alert>
        ) : (
          // otherwise list them in a card
          <Card className="shadow-sm">
            <Card.Body>
              <ListGroup variant="flush">
                {bookings.map((bk) => (
                  <ListGroup.Item
                    key={bk.id}
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div>
                      {/* class title */}
                      <div className="fw-bold">{bk.yoga_class.title}</div>
                      {/* formatted date + time */}
                      <div>
                        {new Date(bk.yoga_class.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                        ,&nbsp;
                        {bk.yoga_class.start_time} ({bk.yoga_class.duration} mins)
                      </div>
                      {/* instructor name */}
                      <div className="text-muted">
                        Instructor: {bk.yoga_class.instructor_name}
                      </div>
                    </div>
                    {/* cancel button */}
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
