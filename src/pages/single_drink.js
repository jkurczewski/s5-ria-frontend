import React, { useState, useEffect } from 'react';
import { Container, ProgressBar, Row, Col, Image, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DrinkForm from './forms/drinks-form';
import './single.css';
import './lists.css';

const api = axios.create({
  baseURL: `http://localhost:8000/api/drinks/`,
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
      alert(`${elem[0].name}został usunięty!`);
      setElem(null);
      navigate('/drinks');
    } catch (error) {
      alert('Podczas usuwania wystąpił błąd');
      console.log(error);
    }
  }

  function getAlcohols() {
    if (Object.keys(elem.ingredients.alcohols).length > 0) {
      const alcohols = elem.ingredients.alcohols;

      return (
        <Row>
          {alcohols.map(function (obj) {
            return (
              <Col md="12" className="card-wrapper alcohols" key={obj.id}>
                <div className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-auto">
                      <Link as={Link} to={`/alcohols/${obj.id}`}>
                        <img
                          src={obj.alcohol_image_url}
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
                          <Link as={Link} to={`/alcohols/${obj.id}`}>
                            {obj.alcohol_name}
                          </Link>
                        </h5>
                        <h6 className="card-title m-0">
                          {obj.alcohol_type} - {obj.alcohol_amount} {obj.alcohol_unit}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      );
    }
  }

  function getBeverages() {
    if (Object.keys(elem.ingredients.beverages).length > 0) {
      const beverages = elem.ingredients.beverages;

      return (
        <Row>
          {beverages.map(function (obj) {
            return (
              <Col md="12" className="card-wrapper beverages" key={obj.id}>
                <div className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-auto">
                      <Link as={Link} to={`/beverages/${obj.id}`}>
                        <img
                          src={obj.beverage_image_url}
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
                          <Link as={Link} to={`/beverages/${obj.id}`}>
                            {obj.beverage_name}
                          </Link>
                        </h5>
                        <h6 className="card-title m-0">
                          {obj.beverage_amount} {obj.beverage_unit}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      );
    }
  }

  function getAdditions() {
    if (Object.keys(elem.ingredients.additions).length > 0) {
      const additions = elem.ingredients.additions;

      return (
        <Row>
          {additions.map(function (obj) {
            return (
              <Col md="12" className="card-wrapper beverages" key={obj.id}>
                <div className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-auto">
                      <Link as={Link} to={`/additions/${obj.id}`}>
                        <img
                          src={obj.addition_image_url}
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
                          <Link as={Link} to={`/additions/${obj.id}`}>
                            {obj.addition_name}
                          </Link>
                        </h5>
                        <h6 className="card-title m-0">
                          {obj.addition_amount} {obj.addition_unit}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      );
    }
  }

  if (!elem)
    return (
      <Container className="my-4">
        <ProgressBar className="bg-danger" animated now={100} />
      </Container>
    );

  return (
    <Container className="my-5 single">
      <Row className="my-4 justify-content-center">
        <Col md="9 mb-5">
          <Row className="">
            <Col>
              <Link className="btn btn-outline-dark" as={Link} to="/drinks">
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
              src={elem[0].image_url}
              onError={(e) => {
                e.target.onError = null;
                e.target.src = '../320.png';
              }}
              className="img-fluid"
              alt="..."
            />
          </div>

          <Col md="8" className="heading-text">
            <h2 className="fw-bold mt-0">{elem[0].name}</h2>
          </Col>
          <h4>Opis</h4>
          <p className="lh-base">{elem[0].description}</p>
          <h4>Przepis</h4>
          <p className="lh-base">{elem[0].recipe}</p>
        </Col>
        <Col md="3">
          <h4 className="mb-3">SKŁADNIKI</h4>
          {getAlcohols(elem)}
          {getBeverages(elem)}
          {getAdditions(elem)}
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
            <h4 className="m-0">EDYCJA DRINKA</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DrinkForm
            isProp="true"
            drinkId={elem[0].id}
            drinkName={elem[0].name}
            drinkDescription={elem[0].description}
            drinkRecipe={elem[0].recipe}
            alcoholsPropTemp={elem.ingredients.alcohols}
            beveragesPropTemp={elem.ingredients.beverages}
            additionsPropTemp={elem.ingredients.additions}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default SingleDrink;
