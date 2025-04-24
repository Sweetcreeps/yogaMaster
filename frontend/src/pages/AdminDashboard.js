// src/pages/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { format, startOfToday, addDays } from 'date-fns';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import api from '../api/axiosConfig';

const classTypes = [
  'Vinyasa Flow',
  'Hatha Yoga',
  'Yin Yoga',
  'Power Yoga',
  'Ashtanga',
  'Restorative',
  'Kundalini',
  'Flow & Restore',
];

// Build next 14 days
const days = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

// Human-friendly label
const dayLabel = (iso) => {
  const dt = new Date(iso),
        today = startOfToday();
  if (dt.toDateString() === today.toDateString()) return 'Today';
  if (dt.toDateString() === addDays(today, 1).toDateString()) return 'Tomorrow';
  return format(dt, 'EEEE, MMMM do');
};

const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [current, setCurrent] = useState({});
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrolledList, setEnrolledList] = useState([]);
  const [enrollError, setEnrollError] = useState('');

  // Fetch classes and instructors on mount
  useEffect(() => {
    Promise.all([
      api.get('classes/'),
      api.get('instructors/'),  // ← fetch only instructors
    ])
      .then(([clsRes, instRes]) => {
        setClasses(clsRes.data);
        setInstructors(instRes.data);
      })
      .catch(() => setError('Unable to load data.'))
      .finally(() => setLoading(false));
  }, []);

  const openForm = (mode, cls = {}) => {
    setFormMode(mode);
    setCurrent(
      mode === 'create'
        ? {
            title: '',
            date: format(startOfToday(), 'yyyy-MM-dd'),
            start_time: '06:00',
            duration: 60,
            capacity: 20,
            instructor: instructors[0]?.id || '',
          }
        : { ...cls }
    );
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      title: current.title,
      date: current.date,
      start_time: current.start_time,
      duration: current.duration,
      capacity: current.capacity,
      instructor: current.instructor,
    };

    const request =
      formMode === 'create'
        ? api.post('classes/', payload)
        : api.put(`classes/${current.id}/`, payload);

    request
      .then((res) => {
        setClasses((prev) =>
          formMode === 'create'
            ? [...prev, res.data]
            : prev.map((c) => (c.id === res.data.id ? res.data : c))
        );
      })
      .catch(() => setError(`Failed to ${formMode} class.`))
      .finally(() => setShowForm(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this class?')) return;
    api
      .delete(`classes/${id}/`)
      .then(() => setClasses((prev) => prev.filter((c) => c.id !== id)))
      .catch(() => setError('Failed to delete class.'));
  };

  const openEnroll = (clsId) => {
    setEnrollError('');
    api
      .get(`bookings/?yoga_class=${clsId}`)
      .then((res) => setEnrolledList(res.data.map((b) => b.user)))
      .catch(() => setEnrollError('Unable to load enrollments.'))
      .finally(() => setShowEnroll(true));
  };

  // Group classes by date
  const grouped = classes.reduce((acc, cls) => {
    acc[cls.date] = acc[cls.date] || [];
    acc[cls.date].push(cls);
    return acc;
  }, {});

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
      <CustomBreadcrumb activeLabel="Admin Dashboard" />

      <Container
        fluid
        className="bg-light text-center py-2"
        style={{ borderBottom: '1px solid #ddd' }}
      >
        <p className="mb-0" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Yoga Master • 123 Serenity Lane, Zen City • Open Daily 6 am–9 pm
        </p>
      </Container>

      <Container style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <Button variant="primary" className="mb-4" onClick={() => openForm('create')}>
          + Add New Class
        </Button>

        {days.map((day) => {
          const iso = format(day, 'yyyy-MM-dd');
          const dayClasses = grouped[iso] || [];
          return (
            <Table key={iso} bordered hover responsive className="mb-5">
              <thead>
                <tr>
                  <th
                    colSpan={5}
                    className="text-white text-center"
                    style={{ backgroundColor: '#343a40' }}
                  >
                    {dayLabel(iso)}
                  </th>
                </tr>
                <tr style={{ backgroundColor: '#495057', color: '#fff' }}>
                  <th>Class</th>
                  <th>Time</th>
                  <th>Instructor</th>
                  <th>Enrolled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dayClasses.length ? (
                  dayClasses.map((cls) => (
                    <tr key={cls.id}>
                      <td>{cls.title}</td>
                      <td>
                        {cls.start_time} ({cls.duration}m)
                      </td>
                      <td>{cls.instructor_name}</td>
                      <td>—</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => openEnroll(cls.id)}
                          className="me-1"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => openForm('edit', cls)}
                          className="me-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(cls.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No classes scheduled.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          );
        })}
      </Container>

      {/* Create/Edit Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{formMode === 'create' ? 'Add Class' : 'Edit Class'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Class Type</Form.Label>
              <Form.Select
                value={current.title}
                onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                required
              >
                <option value="">Select…</option>
                {classTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={current.date}
                onChange={(e) => setCurrent({ ...current, date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={current.start_time}
                onChange={(e) => setCurrent({ ...current, start_time: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration (mins)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={current.duration}
                onChange={(e) => setCurrent({ ...current, duration: Number(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={current.capacity}
                onChange={(e) => setCurrent({ ...current, capacity: Number(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructor</Form.Label>
              <Form.Select
                value={current.instructor}
                onChange={(e) => setCurrent({ ...current, instructor: Number(e.target.value) })}
                required
              >
                <option value="">Select…</option>
                {instructors.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              {formMode === 'create' ? 'Create' : 'Save'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Enrollments Modal */}
      <Modal show={showEnroll} onHide={() => setShowEnroll(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enrolled Students</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {enrollError && <Alert variant="danger">{enrollError}</Alert>}
          <ul className="list-unstyled mb-0">
            {enrolledList.length > 0
              ? enrolledList.map((u, i) => <li key={i}>• {u}</li>)
              : <li>No students enrolled.</li>}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEnroll(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;
