// src/pages/Login.js

import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tabs,
  Tab,
  Alert,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoSmall from '../images/LogoSmallBlk.png';
import CustomBreadcrumb from '../components/CustomBreadcrumb';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [key, setKey] = useState('user');
  const [form, setForm] = useState({
    username: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e, isAdmin = false) => {
    e.preventDefault();
    setErrors('');
    try {
      await login({
        username: form.username,
        password: form.password,
        role: isAdmin ? 'admin' : 'user',
        remember: form.remember,
      });
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    } catch {
      setErrors('Invalid credentials');
    }
  };

  const handleGoogleSignIn = () => {
    // replace with real OAuth flow when available
    window.location.href = '/api/auth/google/';
  };

  return (
    <>
      <CustomBreadcrumb activeLabel="Login" />
      <Container
        className="d-flex flex-column align-items-center justify-content-start"
        style={{ minHeight: '80vh', marginTop: '150px' }}
      >
        <Row className="mb-4">
          <Col className="text-center">
            <img
              src={LogoSmall}
              alt="Yoga Master"
              style={{ maxWidth: '150px' }}
            />
          </Col>
        </Row>
        <Row className="w-100" style={{ maxWidth: '400px' }}>
          <Col>
            <Card>
              <Card.Body>
                {errors && <Alert variant="danger">{errors}</Alert>}
                <Tabs
                  id="login-tabs"
                  activeKey={key}
                  onSelect={(k) => {
                    setKey(k);
                    setErrors('');
                  }}
                  className="mb-3"
                >
                  <Tab eventKey="user" title="User">
                    <Form onSubmit={(e) => handleSubmit(e, false)}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group controlId="rememberMe" className="mb-3">
                        <Form.Check
                          type="checkbox"
                          name="remember"
                          label="Remember Me"
                          checked={form.remember}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Button type="submit" className="w-100 mb-3">
                        Sign In
                      </Button>
                      <Button
                        variant="light"
                        className="w-100 border mb-3"
                        onClick={handleGoogleSignIn}
                      >
                        <img
                          src="https://png.pngtree.com/png-vector/20230817/ourmid/pngtree-google-logo-vector-png-image_9183290.png"
                          alt="Google Icon"
                          style={{ width: '20px', marginRight: '8px' }}
                        />
                        Sign in with Google
                      </Button>
                      <div className="text-center mt-3">
                        <span className="text-muted">Don’t have an account? </span>
                        <Link to="/signup" className="text-primary">
                          Sign up
                        </Link>
                      </div>
                    </Form>
                  </Tab>
                  <Tab eventKey="admin" title="Admin">
                    <Form onSubmit={(e) => handleSubmit(e, true)}>
                      <Form.Group className="mb-3">
                        <Form.Label>Admin Username</Form.Label>
                        <Form.Control
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Button type="submit" className="w-100">
                        Sign In
                      </Button>
                    </Form>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
