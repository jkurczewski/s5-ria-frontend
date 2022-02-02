import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, ProgressBar } from 'react-bootstrap';
import TextTruncate from 'react-text-truncate';
import { Link } from 'react-router-dom';
import './lists.css';
import Pills from '../components/pills';

const api = axios.create({
  baseURL: `http://localhost:8000/api/`,
});

function ListDrinks() {
  const [elems, setElems] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [search, setSearch] = useState([]);

  const getUri = () => {
    const ret = [];
    Object.entries(search).forEach(([key, value]) => {
      if (value !== '') {
        ret.push(`${key}=${value}`);
      }
    });

    return ret.join('&');
  };

  useEffect(() => {
    async function getElems() {
      try {
        const res = await api.get(search === null ? `/drinks` : `/drinks?${getUri()}`);
        const ingRes = await api.get('/ingredients');
        setIngredients(ingRes.data);
        setElems(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getElems();
  }, [search]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch({ ...search, [event.target.name]: event.target.value });
  };

  if (!elems) {
    return (
      <Container className="my-4">
        <ProgressBar variant="bg-danger" animated now={100} />
      </Container>
    );
  }

  return (
    <Container className="my-3 results">
      <Row className="justify-content-md-center">
        <img src="../../drinks.jpg" className="img-fluid img-heading" alt="..." />
        <Col md="8" className="heading-text">
          <h2 className="fw-bold">DRINKI</h2>
          <p className="lh-base">
            Drink, czyli inaczej koktajl, to jeden z najpopularniejszych na świecie sposobów
            serwowania alkoholu, choć ich geneza owiana jest tajemnicą. Mimo że wciąż powstają nowe
            przepisy na koktajle, a najlepsze lokale szczycą się swoimi firmowymi na nie pomysłami,
            istnieje 15 podstawowych typów, których można napić się wszędzie. Jak przygotować
            najpopularniejsze, klasyczne drinki?
          </p>
        </Col>
      </Row>
      <Row>
        <Col md="3" className="filters">
          <form onSubmit={(e) => e.preventDefault()} onChange={(res) => handleSearch(res)}>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="mb-0 fw-bold">NAZWA DRINKA</Form.Label>
                <Form.Control name="name" />
              </Form.Group>
            </Col>
            <hr />
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="mb-0 fw-bold">NAPOJE</Form.Label>
                <Form.Select name="beverage_name">
                  <option key="all" value="">
                    Wszystkie
                  </option>
                  {ingredients.beverages.map((bev) => (
                    <option key={bev.beverage_name} value={bev.beverage_name}>
                      {bev.beverage_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="mb-3">
              <Form.Group>
                <Form.Label className="mb-0 fw-bold">DODATKI</Form.Label>
                <Form.Select name="addition_name">
                  <option key="all" value="">
                    Wszystkie
                  </option>
                  {ingredients.additions.map((bev) => (
                    <option key={bev.addition_name} value={bev.addition_name}>
                      {bev.addition_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="mb-3">
              <Form.Group>
                <Form.Label className="mb-0 fw-bold">ALKOHOLE</Form.Label>
                <Form.Select name="alcohol_name">
                  <option key="all" value="">
                    Wszystkie
                  </option>
                  {ingredients.alcohols.map((bev) => (
                    <option key={bev.alcohol_name} value={bev.alcohol_name}>
                      {bev.alcohol_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col className="mb-3">
              <Form.Group>
                <Form.Label className="mb-0 fw-bold">TYPY ALKOHOLI</Form.Label>
                <Form.Select name="alcohol_type">
                  <option key="all" value="">
                    Wszystkie
                  </option>
                  <option key="gin" value="gin">
                    Gin
                  </option>
                  <option key="rum" value="rum">
                    Rum
                  </option>
                  <option key="whisky" value="whisky">
                    Whisky
                  </option>
                  <option key="vodka" value="vodka">
                    Wódka
                  </option>
                  <option key="tequila" value="tequila">
                    Tequila
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
          </form>
        </Col>
        <Col md="9">
          {elems.map((elem) => (
            <Col md="12" className="card-wrapper" key={elem.id}>
              <hr />
              <div className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-auto">
                    <Link as={Link} to={`${elem.id}`}>
                      <img
                        src={elem.image_url}
                        onError={(e) => {
                          e.target.onError = null;
                          e.target.src = '../320.png';
                        }}
                        className="img-fluid rounded-start"
                        alt="..."
                      />
                    </Link>
                  </div>
                  <div className="col">
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link as={Link} to={`${elem.id}`}>
                          {elem.name}
                        </Link>
                      </h5>
                      <p className="card-text">
                        <TextTruncate
                          line={2}
                          element="span"
                          truncateText="…"
                          text={elem.description}
                        />
                      </p>
                      <Row>
                        <Pills ingredients={elem.ingredients} />
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default ListDrinks;
