import React, { useState, useEffect } from 'react';
import { Container, ProgressBar, Row, Col, Image, Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdditionsForm from './forms/addition-form';
import './single.css';
import './lists.css';

const api = axios.create({
  baseURL: `http://localhost:8000/api/additions/`,
});

function SingleAddition() {
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
      alert(`${elem[0].addition_name}został usunięty!`);
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
        <ProgressBar variant="bg-danger" animated now={100} />
      </Container>
    );

  return (
    <Container className="my-5 single">
      <Row className="my-4 justify-content-center">
        <Col md="9 mb-5">
          <Row className="">
            <Col>
              <Link className="btn btn-outline-dark" as={Link} to="/beverages">
                Powrót do listy
              </Link>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button
                className="btn btn-light btn-outline-danger mx-3"
                onClick={() => setModalShow(true)}
              >
                Edytuj
              </Button>
              <Button className="btn btn-danger" onClick={() => deleteElem()}>
                Usuń
              </Button>
            </Col>
          </Row>
        </Col>
        <Col md="6">
          <div className="img-wrapper">
            <img
              src={elem[0].addition_image_url}
              onError={(e) => {
                e.target.onError = null;
                e.target.src = '../320.png';
              }}
              className="img-fluid"
              alt="..."
            />
          </div>

          <Col md="8" className="heading-text">
            <h2 className="fw-bold mt-0">{elem[0].addition_name}</h2>
          </Col>
        </Col>
        <Col md="3">
          <h4 className="mb-3">POWIĄZANE DRINKI</h4>
          <Row>
            {elem.related_drinks.map((el) => (
              <Col md="12" className="card-wrapper beverages" key={el.id}>
                <div className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-auto">
                      <Link as={Link} to={`/drinks/${el.id}`}>
                        <img
                          src={el.image_url}
                          onError={(e) => {
                            e.target.onError = null;
                            e.target.src = '../320.png';
                          }}
                          className="img-fluid rounded-start"
                          alt="..."
                        />
                      </Link>
                    </div>
                    <div className="col d-flex align-items-center">
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link as={Link} to={`/drinks/${el.id}`}>
                            {el.name}
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
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
        className="forms"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4 className="m-0">EDYCJA DODATKU</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdditionsForm
            isProp="true"
            additionId={elem[0].id}
            additionName={elem[0].addition_name}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default SingleAddition;
