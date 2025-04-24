import React from 'react';
import { Container, Row, Col, Card} from 'react-bootstrap';

const instructors = [
  {
    id: 1,
    name: 'Alice Adams',
    specialty: 'Vinyasa Flow',
    photo: '/images/alice.jpg',
    bio: 'Alice brings over 10 years of teaching experience, blending dynamic movement with mindfulness to create an uplifting practice.',
  },
  {
    id: 2,
    name: 'Bob Brown',
    specialty: 'Hatha Yoga',
    photo: '/images/bob.jpg',
    bio: 'Bob’s classes focus on alignment and breath, offering a strong foundation for students of all levels.',
  },
  {
    id: 3,
    name: 'Clara Chen',
    specialty: 'Yin Yoga',
    photo: '/images/clara.jpg',
    bio: 'Clara specializes in deep‑stretch and relaxation techniques, perfect for unwinding and restoring balance.',
  },
];

const InstructorsSection = () => (
  <Container className="py-5">
    <h2
      className="text-center mb-4"
      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
    >
      Meet Our Instructors
    </h2>
    <Row className="justify-content-center">
      {instructors.map((inst) => (
        <Col key={inst.id} md={4} sm={6} xs={12} className="mb-4">
          <Card className="h-100 text-center shadow-sm">
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <Card.Img
                variant="top"
                src={inst.photo}
                alt={inst.name}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <Card.Body className="d-flex flex-column">
              <Card.Title style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                {inst.name}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{inst.specialty}</Card.Subtitle>
              <Card.Text className="flex-grow-1" style={{ fontSize: '0.9rem' }}>
                {inst.bio}
              </Card.Text>
              
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default InstructorsSection;
