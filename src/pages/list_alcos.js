import React from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import TextTruncate from 'react-text-truncate';
import { Link } from 'react-router-dom';

const api = axios.create({
    baseURL: `http://localhost:8000/api/alcohols`,
});

function ListDrinks() {

    const [elems, setElems] = React.useState(null);

    React.useEffect(() => {
        async function getElems() {
            try {
                const res = await api.get("/");
                setElems(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getElems();
      }, []);

    if (!elems) return (
    <Container className='my-4'>
        <ProgressBar animated now={100} />
    </Container>
    );

    return(
        <Container className='my-4'>
            <h1>Lista drinków</h1>
            <Row>
                {elems.map(
                    elem => 
                    <Col className="p-2" xs="3" key={elem.id}>
                        <Card>
                            <Card.Img variant="top" src='"{elem.image_url}"' />
                            <Card.Body>
                                <Card.Title>{elem.name}</Card.Title>
                                <Card.Text>
                                    <TextTruncate
                                        line={3}
                                        element="span"
                                        truncateText="…"
                                        text= {elem.description}
                                    />
                                </Card.Text>
                                <Button variant="primary">
                                    <Link as={Link} to={ '' + elem.id }>Dowiedz się więcej</Link>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );

};

export default ListDrinks;