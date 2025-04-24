import React, { useState } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import { format, startOfToday } from 'date-fns';

// initial mock announcements (same as public)
const initialAnnouncements = [
  {
    id: 1,
    title: 'Studio Reopens May 1st!',
    date: '2025-05-01',
    content: 'After our spring break, we\'re thrilled to welcome you back on May 1st with a refreshed space and new class times.',
  },
  {
    id: 2,
    title: 'New Evening Flow Class',
    date: '2025-04-25',
    content: 'Join our brand‑new “Flow & Restore” class every Thursday at 7pm—perfect for decompressing after a busy day.',
  },
];

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [showModal, setShowModal] = useState(false);
  const [current, setCurrent] = useState({ id: null, title: '', content: '' });

  const openModal = (anno = null) => {
    if (anno) {
      setCurrent(anno);
    } else {
      setCurrent({
        id: null,
        title: '',
        date: format(startOfToday(), 'yyyy-MM-dd'),
        content: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (current.id == null) {
      // create
      const newId = announcements.length
        ? Math.max(...announcements.map((a) => a.id)) + 1
        : 1;
      setAnnouncements([
        ...announcements,
        { ...current, id: newId, date: format(startOfToday(), 'yyyy-MM-dd') },
      ]);
    } else {
      // edit
      setAnnouncements(
        announcements.map((a) =>
          a.id === current.id ? { ...current } : a
        )
      );
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this announcement?')) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <>
      
      <CustomBreadcrumb activeLabel="Manage Announcements" />

      <Container style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h1 className="mb-4">Manage Announcements</h1>
        <Button variant="primary" className="mb-4" onClick={() => openModal()}>
          + New Announcement
        </Button>

        <Table bordered hover>
          <thead style={{ backgroundColor: '#343a40', color: '#fff' }}>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.date}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="me-2"
                    onClick={() => openModal(a)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Create / Edit Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {current.id == null ? 'New Announcement' : 'Edit Announcement'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="annoTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={current.title}
                onChange={(e) =>
                  setCurrent((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="annoContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={current.content}
                onChange={(e) =>
                  setCurrent((prev) => ({ ...prev, content: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {current.id == null ? 'Create' : 'Save'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      
    </>
  );
};

export default AdminAnnouncements;
