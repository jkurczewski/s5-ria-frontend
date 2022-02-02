import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './navigation.css';

export default function Navigation(props) {
  const [active, setActive] = useState('default');

  return (
    <Navbar className="navigation_wrapper sticky-top">
      <Container className="navigation">
        <Col className="col-md-auto">
          <Navbar.Brand className="m-0" as={Link} to="/">
            <h1 className="lead m-0">
              <strong className="fw-bold">DRINKS</strong>
              <strong className="">LIST</strong>
            </h1>
          </Navbar.Brand>
        </Col>
        <Col>
          <Nav
            activeKey={active}
            onSelect={(selectedKey) => setActive(selectedKey)}
            className="d-flex w-100 justify-content-center fw-bold "
          >
            <Nav.Link eventKey="drinks" as={Link} to="/drinks">
              <span>DRINKI</span>
            </Nav.Link>
            <Nav.Link eventKey="alcohols" as={Link} to="/alcohols">
              <span>ALKOHOLE</span>
            </Nav.Link>
            <Nav.Link eventKey="beverages" as={Link} to="/beverages">
              <span>NAPOJE</span>
            </Nav.Link>
            <Nav.Link eventKey="additions" as={Link} to="/additions">
              <span>DODATKI</span>
            </Nav.Link>
          </Nav>
        </Col>
        <Nav.Link className="col-md-auto fw-bold " eventKey="add" as={Link} to="/add">
          <span>
            <u>DODAJ NOWE</u>
          </span>
        </Nav.Link>
      </Container>
    </Navbar>
  );
}
