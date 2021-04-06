import React from 'react';
import { Col } from 'react-bootstrap';
import ProfileStrength from './ProfileStrength';
import Dashboard from './Dashboard';

const Main = () => {
  return (
    <Col md={8}>
      <ProfileStrength />
      <Dashboard />
    </Col>
  );
};

export default Main;
