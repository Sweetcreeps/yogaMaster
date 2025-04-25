import React, { useState, useEffect } from 'react'; // Just grabbing React and the hooks we need – useState and useEffect
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
} from 'react-bootstrap'; // Pulling in some Bootstrap components because styling is life
import { useSearchParams, useNavigate } from 'react-router-dom'; // For grabbing URL params and navigating after payment
import { loadStripe } from '@stripe/stripe-js'; // Stripe.js loader
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'; // React bindings for Stripe.js
import api from '../api/axiosConfig'; // Axios setup for our backend calls

// Initialize Stripe with your publishable key from .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY); // I like keeping this outside the component so it doesn’t reload on every render

// Define your plans (price in pence)
const plans = {
  '1': { id: 1, name: 'Individual Class', price: 1000 },      // £10.00 – simple one-off price
  '2': { id: 2, name: 'Monthly Subscription', price: 4000 },  // £40.00 – recurring vibes (if you handle subscriptions server-side)
};

const CheckoutForm = ({ plan }) => {
  const stripe = useStripe(); // Stripe instance
  const elements = useElements(); // Elements instance
  const navigate = useNavigate(); // Router navigation helper

  // Local state for form fields and UI feedback
  const [email, setEmail] = useState(''); 
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return; // Wait until Stripe.js has loaded

    setProcessing(true);  // Disable the button and show spinner
    setError(null);       // Clear previous errors

    // 1. Create a PaymentMethod
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: { name, email },
    });
    if (pmError) {
      setError(pmError.message); // Show Stripe’s card errors
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
      setSucceeded(true); // Let the user know we’re all good
      setTimeout(() => navigate('/dashboard'), 1500); // Give them a sec to read the success message
    } catch (err) {
      setError(err.response?.data?.detail || 'Purchase failed.'); // Handle backend errors gracefully
    } finally {
      setProcessing(false); // Always hide the spinner in the end
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
          <h3 className="mb-4">{plan.name}</h3> {/* Show which plan they picked */}
          <p className="lead">Amount: £{(plan.price / 100).toFixed(2)}</p> {/* Convert pence to pounds */}

          <Form.Group controlId="customerName" className="mb-3">
            <Form.Label>Name on Card</Form.Label>
            <Form.Control
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            /> {/* Collect the cardholder’s name */}
          </Form.Group>

          <Form.Group controlId="customerEmail" className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /> {/* Collect email for receipts or follow-ups */}
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
            </div> {/* Fancy container for the Stripe card input */}
          </Form.Group>

          <Form.Group controlId="rememberCard" className="mb-4">
            <Form.Check
              type="checkbox"
              name="remember"
              label="Remember this card for future purchases"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            /> {/* Let them choose to save their card */}
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>} {/* Show any errors */}

          <Button
            type="submit"
            variant="primary"
            disabled={!stripe || processing}
            className="w-100"
          >
            {processing ? <Spinner animation="border" size="sm" /> : 'Pay Now'}
          </Button> {/* Submit button with spinner */}
        </Form>
      )}
    </Card>
  );
};

const Checkout = () => {
  const [params] = useSearchParams();
  const planId = params.get('plan') || '1'; // Default to plan 1 if none provided
  const plan = plans[planId];
  const [validPlan, setValidPlan] = useState(true);

  useEffect(() => {
    if (!plan) {
      console.error('Unknown plan:', planId);
      setValidPlan(false); // If they tampered with the URL, let them know
    }
  }, [planId, plan]);

  if (!validPlan) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">Invalid plan selected.</Alert>
      </Container>
    ); // Friendly error for invalid plan
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh', marginTop: '80px' }}
    > {/* Center the form nicely */}
      <Row className="w-100" style={{ maxWidth: '500px' }}>
        <Col>
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} /> {/* Wrap form in Stripe Elements */}
          </Elements>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout; // And that’s our Checkout component – nice and modular!
