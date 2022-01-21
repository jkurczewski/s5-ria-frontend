import React from 'react';
import { Navbar, Container, Nav, Button, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom'

function Navigation() {
    return(
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand to="/"><h1 className='lead m-0'><strong>DRINKS</strong></h1></Navbar.Brand>
                <Nav className="d-flex w-100 justify-content-between">
                    <Nav.Link as={Link} to="/">Strona główna</Nav.Link>
                    <Nav.Link as={Link} to="/drinks">Drinki</Nav.Link>
                    <Nav.Link as={Link} to="/alcohols">Alkohole</Nav.Link>
                    <Nav.Link as={Link} to="/beverages">Napoje</Nav.Link>
                    <Nav.Link as={Link} to="/additions">Dodatki</Nav.Link>
                    <Col className="d-flex justify-content-end">
                        <Button className="d-flex justify-content-end" variant="outline-light"><Link as={Link} to="/add">Dodaj nowy...</Link></Button>
                    </Col>   
                </Nav>

            </Container>
        </Navbar>
    );
};

export default Navigation;