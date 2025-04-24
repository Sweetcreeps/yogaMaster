// src/pages/Checkout.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
} from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../api/axiosConfig';

// Initialize Stripe with your publishable key from .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

// Define your plans (price in pence)
const plans = {
  '1': { id: 1, name: 'Individual Class', price: 1000 },      // £10.00
  '2': { id: 2, name: 'Monthly Subscription', price: 4000 },  // £40.00
};

const CheckoutForm = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    // 1. Create a PaymentMethod
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: { name, email },
    });
    if (pmError) {
      setError(pmError.message);
      setProcessing(false);
      return;
    }

    // 2. Send to backend
    try {
      await api.post('checkout/', {
        package: plan.id,
        stripe_payment_method: paymentMethod.id,
        cardholder_name: name,
        email,
        remember,
      });
      setSucceeded(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Purchase failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      {succeeded ? (
        <Alert variant="success">
          Payment succeeded! Redirecting to your dashboard…
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          <h3 className="mb-4">{plan.name}</h3>
          <p className="lead">Amount: £{(plan.price / 100).toFixed(2)}</p>

          <Form.Group controlId="customerName" className="mb-3">
            <Form.Label>Name on Card</Form.Label>
            <Form.Control
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="customerEmail" className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="cardElement" className="mb-4">
            <Form.Label>Card Details</Form.Label>
            <div
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem',
              }}
            >
              <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
            </div>
          </Form.Group>

          <Form.Group controlId="rememberCard" className="mb-4">
            <Form.Check
              type="checkbox"
              name="remember"
              label="Remember this card for future purchases"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button
            type="submit"
            variant="primary"
            disabled={!stripe || processing}
            className="w-100"
          >
            {processing ? <Spinner animation="border" size="sm" /> : 'Pay Now'}
          </Button>
        </Form>
      )}
    </Card>
  );
};

const Checkout = () => {
  const [params] = useSearchParams();
  const planId = params.get('plan') || '1';
  const plan = plans[planId];
  const [validPlan, setValidPlan] = useState(true);

  useEffect(() => {
    if (!plan) {
      console.error('Unknown plan:', planId);
      setValidPlan(false);
    }
  }, [planId, plan]);

  if (!validPlan) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">Invalid plan selected.</Alert>
      </Container>
    );
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh', marginTop: '80px' }}
    >
      <Row className="w-100" style={{ maxWidth: '500px' }}>
        <Col>
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} />
          </Elements>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
