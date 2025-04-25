// src/pages/Home.js

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../images/homeHero.jpg';
import BookImg from '../images/bookClassHome.jpg'; 
import InstructorsSection from '../components/InstructorsSection';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookNow = () => {
    if (user) {
      navigate('/schedule');
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      {/* HERO IMAGE */}
      <Container fluid className="p-0">
        <img
          src={BookImg}
          alt="Welcome"
          className="img-fluid w-100"
          style={{ maxHeight: '1000px', width: 'auto' }}
        />
      </Container>

      {/* WELCOME TITLE CONTAINER */}
      <Container className="py-4 text-center" style={{ backgroundColor: '#f8f9fa', marginTop: '80px' }}>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700' }}>
          Welcome to Yoga Master
        </h2>
        <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
          At Yoga Master, we ignite the spark within you to achieve holistic excellence. Empower your mind, body, and spirit as you embark on a transformative journey of balance and innovation. Embrace ancient wisdom fused with modern passion, propelling you to new heights of success.
        </p>
      </Container>

      <InstructorsSection />

      {/* BOOK TODAY SECTION */}
      <Container fluid className="py-5" id="bookToday" style={{ backgroundColor: '#111', color: '#fff' }}>
        <Container>
          <Row className="align-items-center">
            {/* LEFT COLUMN: IMAGE */}
            <Col md={6} className="mb-4 mb-md-0">
              <img
                src={heroImage} 
                alt="Inspiring Yoga"
                className="img-fluid rounded"
              />
            </Col>

            {/* RIGHT COLUMN: PARAGRAPH & BOOK NOW BUTTON */}
            <Col md={6}>
              <h2 className="mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700' }}>
                Book a Class Today
              </h2>
              <p className="mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Unlock your potential at Yoga Master, where timeless wisdom meets modern innovation. Experience transformative yoga sessions that cultivate balance, clarity, and peak performance. Book your class today and begin your journey toward success.
              </p>
              <Button
                variant="light"
                size="lg"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default Home;
