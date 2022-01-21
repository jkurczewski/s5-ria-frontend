import React from 'react';
import { Container, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const api = axios.create({
    baseURL: `http://localhost:8000/api/drinks/`,
});

function SingleDrink() {
    const [elem, setElem] = React.useState(null);
    const { id } = useParams();

    React.useEffect(() => {
        async function getElem() {
            try {
                const res = await api.get("/" + id);
                setElem(res.data);
            } catch (err) {
                console.log()
            }
        }
        getElem();
    }, []);
    
    console.log(elem);

    if (!elem) return (
        <Container className='my-4'>
            <ProgressBar animated now={100} />
        </Container>
    );

    return(
        <Container className='my-4'>
            <h1>Lista drinków</h1>
            {/* <Row>
                {drinks.map(
                    drink => 
                    <Col className="p-2" xs="3" key={drink.id}>
                        <Card>
                            <Card.Img variant="top" src='"{drink.image_url}"' />
                            <Card.Body>
                                <Card.Title>{drink.name}</Card.Title>
                                <Card.Text>
                                    <TextTruncate
                                        line={3}
                                        element="span"
                                        truncateText="…"
                                        text= {drink.description}
                                    />
                                </Card.Text>
                                <Button variant="primary">
                                    <Link as={Link} to={ '' + drink.id }>Dowiedz się więcej</Link>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row> */}
        </Container>
    );
};

export default SingleDrink;