import React from 'react';
import { Container, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomBreadcrumb = ({ activeLabel, offset = '74px' }) => (
  <Container
    fluid
    className="p-0"
    style={{ marginTop: offset }}
  >
    <Breadcrumb
      className="breadcrumb-custom"
      style={{ borderTop: '1px solid #fff' }}
    >
      <Breadcrumb.Item
        linkAs={Link}
        linkProps={{ to: '/' }}
      >
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item active>
        {activeLabel}
      </Breadcrumb.Item>
    </Breadcrumb>
  </Container>
);

export default CustomBreadcrumb;
