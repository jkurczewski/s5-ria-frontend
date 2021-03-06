import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css';

function Footer() {
  return (
    <Container fluid id="footer" className="bg-dark">
      <Row>
        <Col className="text-white">
          Made in React by <b>Jakub Kurczewski</b>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
