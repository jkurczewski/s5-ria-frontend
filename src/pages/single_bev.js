import React, { useState, useEffect } from 'react';
import { Container, ProgressBar, Row, Col, Image, Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BeverageForm from './forms/beverage-form';

const api = axios.create({
  baseURL: `http://localhost:8000/api/beverages/`,
});

function SingleDrink() {
  const [elem, setElem] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    async function getElem() {
      try {
        const res = await api.get(`/${id}`);
        setElem(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getElem();
  }, []);

  async function deleteElem() {
    try {
      await api.delete(`/${id}`);
      alert(`${elem[0].beverage_name}został usunięty!`);
      setElem(null);
      navigate('/additions');
    } catch (error) {
      alert('Podczas usuwania wystąpił błąd');
      console.log(error);
    }
  }

  if (!elem)
    return (
      <Container className="my-4">
        <ProgressBar animated now={100} />
      </Container>
    );

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Link className="btn btn-outline-dark" as={Link} to="/beverages">
            Powrót do listy
          </Link>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button className="btn btn-Info mx-3" onClick={() => setModalShow(true)}>
            Edytuj
          </Button>
          <Button className="btn btn-danger" onClick={() => deleteElem()}>
            Usuń
          </Button>
        </Col>
      </Row>
      <Row className="my-4">
        <Col xs="3">
          <Image
            src={elem[0].beverage_image_url}
            fluid="true"
            onError={(e) => {
              e.target.onError = null;
              e.target.src = '../320.png';
            }}
          />
        </Col>
        <Col xs="9">
          <h1>{elem[0].beverage_name}</h1>
          <p>{elem[0].beverage_description}</p>
          <hr />
          <h5>Smak</h5>
          <p>{elem[0].beverage_flavour}</p>
        </Col>
        <Col xs="12" className="mt-4">
          <h2>Powiązane drinki</h2>
          <Row>
            {elem.related_drinks.map((el) => (
              <Col className="p-2" xs="6" md="3" lg="2" key={el.drink_id}>
                <Link as={Link} to={`/drinks/${el.drink_id}`}>
                  <Card>
                    <Card.Img
                      variant="top"
                      onError={(e) => {
                        e.target.onError = null;
                        e.target.src = '../320.png';
                      }}
                      src={el.beverage_image_url}
                    />
                    <Card.Body>
                      <Card.Title>{el.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Edycja napoju</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BeverageForm
            isProp="true"
            beverageId={elem[0].id}
            beverageName={elem[0].beverage_name}
            beverageFlavour={elem[0].beverage_flavour}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default SingleDrink;
