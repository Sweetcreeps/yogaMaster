import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#343a40', // Dark background matching the header
      color: '#fff',
      padding: '3rem 0',
      fontSize: '0.9rem'
    }}>
      <Container>
        <Row>
          {/* Column 1: Brand and Tagline */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700' }}>Yoga Master</h5>
            <p>
              Your sanctuary for holistic wellness, where ancient tradition meets modern innovation.
              Find your inner peace with us.
            </p>
          </Col>

          {/* Column 2: Navigation Links */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700' }}>Explore</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</a>
              </li>
              <li>
                <a href="/schedule" style={{ color: '#fff', textDecoration: 'none' }}>Classes</a>
              </li>
              <li>
                <a href="/instructors" style={{ color: '#fff', textDecoration: 'none' }}>Instructors</a>
              </li>
              <li>
                <a href="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</a>
              </li>
            </ul>
          </Col>

          {/* Column 3: Contact & Social Links */}
          <Col md={4}>
            <h5 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700' }}>Connect</h5>
            <p>Email: info@yogamaster.com</p>
            <p>Phone: (123) 456-7890</p>
            <div>
              <a href="https://facebook.com" style={{ color: '#fff', marginRight: '1rem' }}>
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" style={{ color: '#fff', marginRight: '1rem' }}>
                <FaTwitter />
              </a>
              <a href="https://instagram.com" style={{ color: '#fff', marginRight: '1rem' }}>
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        {/* Bottom Row: Copyright */}
        <Row className="pt-4 mt-4 border-top" style={{ borderColor: '#495057' }}>
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} Yoga Master. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
