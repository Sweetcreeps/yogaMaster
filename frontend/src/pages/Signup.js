import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import CustomBreadcrumb from '../components/CustomBreadcrumb';

const Signup = () => {
  const navigate = useNavigate();
  // form holds our input values; errors tracks validation feedback
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  // update form field and clear any existing error for that field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: '' }));
  };

  // basic client-side checks before hitting the API
  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = 'Valid email is required';
    if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm)
      errs.confirm = 'Passwords do not match';
    return errs;
  };

  // attempt to create account, show errors or redirect on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      await api.post('users/', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
      // give user a moment to see the success message
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
      // show username-related API errors or a generic message
      setServerError(
        err.response?.data?.username
          ? err.response.data.username.join(' ')
          : 'Failed to create account'
      );
    }
  };

  // after successful signup, show a confirmation before redirect
  if (success) {
    return (
      <Container className="text-center my-5">
        <Alert variant="success">
          Account created! Redirecting to{' '}
          <Link to="/login">Sign In</Link>…
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <CustomBreadcrumb activeLabel="Sign Up" />
      <Container
        className="d-flex flex-column align-items-center justify-content-start"
        style={{ minHeight: '80vh', marginTop: '150px' }}
      >
        <Row className="w-100" style={{ maxWidth: '400px' }}>
          <Col>
            <Card>
              <Card.Body>
                <h3 className="text-center mb-4">Create Account</h3>
                {serverError && (
                  <Alert variant="danger">{serverError}</Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirm"
                      value={form.confirm}
                      onChange={handleChange}
                      isInvalid={!!errors.confirm}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirm}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Sign Up
                  </Button>
                </Form>

                {/* link back to login for existing users */}
                <div className="text-center mt-3">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary">
                    Sign in
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;
