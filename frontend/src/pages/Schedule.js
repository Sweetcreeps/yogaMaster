// src/pages/Schedule.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Modal,
  Button,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { format, startOfToday, addDays } from 'date-fns';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import api from '../api/axiosConfig';

const descriptions = {
  'Vinyasa Flow':
    'A dynamic practice linking breath with movement in a continuous, energizing flow.',
  'Hatha Yoga':
    'A foundational style focusing on alignment, posture, and mindful breathing.',
  'Yin Yoga':
    'A slow‑paced practice holding passive poses to stretch deep connective tissues.',
  'Power Yoga':
    'A vigorous, fitness‑based approach building strength, flexibility, and stamina.',
  Ashtanga:
    'A disciplined sequence of postures performed in a set order to build heat and focus.',
  Restorative:
    'A gentle session using props to support the body, encouraging deep relaxation and healing.',
  Kundalini:
    'A practice combining movement, breathwork, and sound to awaken inner energy.',
  'Flow & Restore':
    'A balanced class blending dynamic flow segments with restorative holds for equilibrium.',
};

// Build next 14 days
const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

// Human‑friendly day label
const dayLabel = (iso) => {
  const dt = new Date(iso);
  const today = startOfToday();
  if (dt.toDateString() === today.toDateString()) return 'Today';
  if (dt.toDateString() === addDays(today, 1).toDateString()) return 'Tomorrow';
  return format(dt, 'EEEE, MMMM do');
};

const Schedule = () => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    api.get('classes/')
      .then((res) => {
        const grouped = {};
        res.data.forEach((cls) => {
          const date = cls.date;
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(cls);
        });
        setSchedule(grouped);
      })
      .catch((err) => {
        console.error('Schedule fetch error:', err);
        const msg = err.response
          ? `Error ${err.response.status}: ${err.response.statusText}`
          : err.message;
        setError(`Unable to load schedule — ${msg}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRowClick = (cls) => {
    setSelectedClass(cls);
    setShowModal(true);
  };

  const handleEnroll = () => {
    api.post('bookings/', { yoga_class: selectedClass.id })
      .then(() => {
        alert(`You have been enrolled in "${selectedClass.title}"!`);
        setShowModal(false);
      })
      .catch(() => {
        alert('Error enrolling—please try again.');
      });
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <CustomBreadcrumb activeLabel="Schedule" />

      {/* Location Info Banner */}
      <Container
        fluid
        className="bg-light text-center py-2"
        style={{ marginTop: '80px', borderBottom: '1px solid #ddd' }}
      >
        <p className="mb-0" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Yoga Master • 123 Serenity Lane, Zen City • Open Daily 6 am–9 pm
        </p>
      </Container>

      {/* Schedule Tables */}
      <Container style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        {days.map((day) => {
          const iso = format(day, 'yyyy-MM-dd');
          const classes = schedule[iso] || [];

          return (
            <Table key={iso} bordered hover responsive className="mb-5">
              <thead>
                <tr>
                  <th
                    colSpan={3}
                    className="text-white text-center"
                    style={{ backgroundColor: '#343a40' }}
                  >
                    {dayLabel(iso)}
                  </th>
                </tr>
                <tr style={{ backgroundColor: '#495057', color: '#fff' }}>
                  <th>Class</th>
                  <th>Time (Duration)</th>
                  <th>Instructor</th>
                </tr>
              </thead>
              <tbody>
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <tr
                      key={cls.id}
                      onClick={() => handleRowClick(cls)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{cls.title.toUpperCase()}</td>
                      <td style={{ color: '#343a40', fontWeight: 500 }}>
                        {cls.start_time} ({cls.duration} mins)
                      </td>
                      <td>{cls.instructor}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      No classes scheduled.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          );
        })}
      </Container>

      {/* Booking Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="md"
        dialogClassName="p-3"
      >
        <Modal.Header closeButton style={{ backgroundColor: '#343a40', color: '#fff' }}>
          <Modal.Title>{selectedClass?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
          {selectedClass && (
            <>
              <p>
                <strong>Time:</strong> {selectedClass.start_time} ({selectedClass.duration} mins)
              </p>
              <p>
                <strong>Instructor:</strong> {selectedClass.instructor}
              </p>
              <hr />
              <p style={{ fontStyle: 'italic' }}>
                {selectedClass.description || descriptions[selectedClass.title]}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#f8f9fa' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleEnroll}>
            Enroll
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Schedule;
