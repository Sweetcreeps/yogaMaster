import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
  const { user } = useAuth(); // grab current user to maybe hide/show features later
  const [packages, setPackages] = useState([]); // pricing plans from server
  const [loading, setLoading]   = useState(true); // spinner until data arrives
  const [error, setError]       = useState('');   // to display any fetch errors

  useEffect(() => {
    // fetch available packages on mount
    api.get('packages/')
      .then(res => setPackages(res.data))
      .catch(() => setError('Unable to load pricing plans.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    // simple loading state before rendering actual content
    return <div className="text-center my-5"><Spinner animation="border"/></div>;
  }

  return (
    <>
      <CustomBreadcrumb activeLabel="Pricing" />
      <Container style={{ marginTop:'1rem', marginBottom:'4rem' }}>
        {error && <Alert variant="danger">{error}</Alert>} {/* show error if fetch failed */}
        <h1 className="my-4">Choose Your Plan</h1>
        <Row className="g-4">
          {packages.map((plan) => (
            <Col key={plan.id} md={6} sm={12}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  {/* Package name with a bold, clean font */}
                  <Card.Title style={{ fontFamily:'Montserrat', fontWeight:700 }}>
                    {plan.name}
                  </Card.Title>
                  {/* Price shown in pounds with no decimals */}
                  <h2 style={{ color:'#343a40', fontWeight:700 }}>
                    £{Number(plan.price).toFixed(0)}
                  </h2>
                  {/* brief description from backend */}
                  <p className="flex-grow-1">{plan.description}</p>
                  {/* CTA button navigates to checkout with plan ID */}
                  <Button
                    as={Link}
                    to={`/checkout?plan=${plan.id}`}
                    variant="primary"
                    size="lg"
                    className="mt-auto"
                  >
                    {/* custom text depending on plan type */}
                    {plan.name === 'Monthly Subscription' ? 'Subscribe Now' : 'Buy Class'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Pricing;
