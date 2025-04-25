import React, { useState, useEffect } from 'react'; // pulling in hooks for state and lifecycle
import {
  Container,
  Card,
  ListGroup,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
} from 'react-bootstrap'; // Bootstrap components for layout and UI
import CustomBreadcrumb from '../components/CustomBreadcrumb'; // breadcrumb nav
import { useAuth } from '../context/AuthContext'; // auth context to check staff status
import api from '../api/axiosConfig'; // axios instance for API calls

export default function Announcements() {
  const { user } = useAuth(); // current user info
  const [announcements, setAnnouncements] = useState([]); // store fetched announcements
  const [loading, setLoading]       = useState(true);   // loading indicator
  const [error, setError]           = useState('');     // error messages

  // “New Announcement” modal state
  const [showModal, setShowModal]   = useState(false);
  const [formData, setFormData]     = useState({ title: '', content: '' });
  const [saving, setSaving]         = useState(false); // saving indicator

  // load announcements on mount
  useEffect(() => {
    api.get('announcements/')
      .then(res => setAnnouncements(res.data))
      .catch(() => setError('Failed to load announcements.'))
      .finally(() => setLoading(false));
  }, []);

  // handle creating a new announcement
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('announcements/', formData);
      // prepend new announcement so it appears at top
      setAnnouncements([res.data, ...announcements]);
      setShowModal(false); // hide modal on success
      setFormData({ title: '', content: '' }); // reset form
    } catch (err) {
      console.error('Announcement save error:', err.response?.data);
      alert(`Save failed: ${JSON.stringify(err.response?.data)}`); // quick feedback
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    // show spinner while fetching
    return <div className="text-center my-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <CustomBreadcrumb activeLabel="Announcements" />

      <Container style={{ marginTop: '80px', marginBottom: '2rem' }}>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* only staff can post new announcements */}
        {user?.is_staff && (
          <div className="mb-4 text-end">
            <Button onClick={() => setShowModal(true)}>New Announcement</Button>
          </div>
        )}

        {announcements.length === 0 ? (
          <Alert variant="info">No announcements yet.</Alert> // friendly empty state
        ) : (
          <ListGroup>
            {announcements.map((a) => (
              <ListGroup.Item key={a.id} className="mb-3">
                <Card>
                  <Card.Header>
                    <strong>{a.title}</strong>
                    <span className="text-muted float-end">
                      {new Date(a.date).toLocaleString()} by {a.author_name}
                    </span>
                  </Card.Header>
                  <Card.Body>{a.content}</Card.Body>
                </Card>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>

      {/* New Announcement Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Announcement</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required // ensure title isn’t empty
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required // ensure content isn’t empty
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Publishing…' : 'Publish'} {/* feedback on save */}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
