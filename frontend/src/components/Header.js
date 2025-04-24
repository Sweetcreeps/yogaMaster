// src/components/Header.js

import React, { useState } from 'react';
import {
  Navbar,
  Container,
  Nav,
  Button,
  Offcanvas,
} from 'react-bootstrap';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../images/LogoLong.png'; 

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleShow = () => setShowMenu(true);
  const handleClose = () => setShowMenu(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    handleClose();
  };

  return (
    <>
      {/* Navbar with fixed positioning */}
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container className="d-flex align-items-center">
          {/* Left: Hamburger Icon */}
          <Button
            variant="outline-light"
            onClick={handleShow}
            style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FaBars size={24} />
            <span id="MenuBtnLabl">Menu</span>
          </Button>

         {/* Center: Brand Title */}
         <Navbar.Brand style={{ flex: '1 1 auto', textAlign: 'center', padding: 0 }}>
            <Link to="/">
              <img
                src={Logo}
                id="LogoLong"
                alt="Yoga Master"
                className="d-inline-block align-top"
              />
            </Link>
          </Navbar.Brand>

          {/* Right: User Icon or Username + Logout */}
          <Nav style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <>
                <span className="text-light d-flex align-items-center gap-1">
                  <FaUserCircle size={24} />
                  {user.username}
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="d-flex align-items-center gap-1">
                <FaUserCircle size={24} />
                <span id="LoginBtnLabl">Login</span>
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Offcanvas Dropdown Menu */}
      <Offcanvas
        show={showMenu}
        onHide={handleClose}
        placement="start"
        className="offcanvas-dark"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/schedule" onClick={handleClose}>
              Schedule
            </Nav.Link>
            <Nav.Link as={Link} to="/pricing" onClick={handleClose}>
              Pricing
            </Nav.Link>
            {user && user.role !== 'admin' && (
              <Nav.Link as={Link} to="/dashboard" onClick={handleClose}>
                My Bookings
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/announcements" onClick={handleClose}>
              Announcements
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={handleClose}>
              Contact
            </Nav.Link>
           
            {user?.role === 'admin' && (
              <>
               <Offcanvas.Header closeVariant="white">
                <Offcanvas.Title>Admin Menu</Offcanvas.Title>
              </Offcanvas.Header>
                <hr className="border-secondary" />
                <Nav.Link as={Link} to="/admin" onClick={handleClose}>
                  Admin Console
                </Nav.Link>
                <Nav.Link as={Link} to="/adminAnnouncements" onClick={handleClose}>
                  Manage Announcements
                </Nav.Link>
              </>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
