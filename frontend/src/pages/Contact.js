import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Breadcrumb,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import CustomBreadcrumb from '../components/CustomBreadcrumb';


const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = 'Valid email is required';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      console.log('Sending message:', form);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <>
     
     <CustomBreadcrumb activeLabel="Contact" />
    

      {/* Page Header */}
      <Container style={{ marginBottom: '2rem' }}>
        <h1 className="my-4">Get in Touch</h1>
      </Container>

       {/* Main Content */}
       <Container style={{ marginBottom: '4rem' }}>
        <Row>
          {/* Left: Contact Info */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Contact Details</h5>
            <div className="contact-info">
              <div className="d-flex align-items-start mb-3">
                <FaMapMarkerAlt className="me-3 mt-1 text-primary" size={20} />
                <div>
                  <strong>Address</strong><br />
                  123 Wellness Street, London, UK
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <FaPhoneAlt className="me-3 mt-1 text-primary" size={20} />
                <div>
                  <strong>Phone</strong><br />
                  +44 20 7946 0857
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <FaEnvelope className="me-3 mt-1 text-primary" size={20} />
                <div>
                  <strong>Email</strong><br />
                  info@yogamaster.com
                </div>
              </div>
              <div className="d-flex align-items-start">
                <FaClock className="me-3 mt-1 text-primary" size={20} />
                <div>
                  <strong>Hours</strong><br />
                  Mon–Fri: 6am–9pm<br />
                  Sat–Sun: 8am–8pm
                </div>
              </div>
            </div>
          </Col>

          {/* Right: Contact Form */}
          <Col md={8}>
            {submitted && (
              <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                Thank you! Your message has been sent.
              </Alert>
            )}
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="contactName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={form.name}
                  isInvalid={!!errors.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="contactEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  isInvalid={!!errors.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="contactSubject" className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={form.subject}
                  isInvalid={!!errors.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.subject}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="contactMessage" className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={form.message}
                  isInvalid={!!errors.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit">
                Send Message
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      
    </>
  );
};

export default Contact;
