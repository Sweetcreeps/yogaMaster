// src/pages/Announcements.js

import React, { useState } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomBreadcrumb from '../components/CustomBreadcrumb';

// initial mock announcements
const initialAnnouncements = [
  {
    id: 1,
    title: 'Studio Reopens May 1st!',
    date: '2025-05-01',
    content:
      "After our spring break, we're thrilled to welcome you back on May 1st with a refreshed space and new class times.",
  },
  {
    id: 2,
    title: 'New Evening Flow Class',
    date: '2025-04-25',
    content:
      'Join our brand‑new “Flow & Restore” class every Thursday at 7pm—perfect for decompressing after a busy day.',
  },
];

const Announcements = () => {
  const [announcements] = useState(initialAnnouncements);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
    // TODO: send email to backend/store
  };

  return (
    <>
      
      <CustomBreadcrumb activeLabel="Announcements" />

      <Container style={{ marginTop: '1rem', marginBottom: '3rem' }}>
        <h1 className="mb-4">Announcements</h1>

        {announcements.map((a) => (
          <Card key={a.id} className="mb-4 shadow-sm">
            <Card.Header as="h5">
              {a.title}{' '}
              <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                ({a.date})
              </small>
            </Card.Header>
            <Card.Body>
              <Card.Text>{a.content}</Card.Text>
            </Card.Body>
          </Card>
        ))}

        {/* Newsletter Subscribe Form */}
        <Card className="mt-5 shadow-sm border-0">
          <Card.Body className="p-4">
            <h4 className="mb-3">Subscribe to Our Newsletter</h4>
            {subscribed && (
              <Alert variant="success">
                Thanks for subscribing! You’ll hear from us soon.
              </Alert>
            )}
            <Form noValidate onSubmit={handleSubscribe}>
              <Row className="align-items-center">
                <Col xs={12} md={8}>
                  <Form.Group controlId="newsletterEmail" className="mb-2">
                    <Form.Label className="visually-hidden">
                      Your Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      isInvalid={!!error}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12} md={4}>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-2"
                  >
                    Subscribe
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      
    </>
  );
};

export default Announcements;
