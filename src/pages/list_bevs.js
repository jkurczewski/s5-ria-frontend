import React from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ProgressBar, Form } from 'react-bootstrap';
import TextTruncate from 'react-text-truncate';
import { Link } from 'react-router-dom';
import './lists.css';

const api = axios.create({
  baseURL: `http://localhost:8000/api/beverages`,
});

export default function ListBeverages() {
  const [elems, setElems] = React.useState(null);
  let search = [];

  React.useEffect(() => {
    async function getElems() {
      try {
        const res = await api.get('/');
        setElems(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getElems();
  }, []);

  const getSearch = (e) => {
    if (e.target.name === 'beverage_name' && e.target.value.length < 3) {
      return;
    }

    if (e.target.value === '') {
      const searchArr = search;
      delete searchArr[e.target.name];
    } else {
      search = { ...search, [e.target.name]: e.target.value };
    }
  };

  const handleSearch = (event) => {
    getSearch(event);
    const searchUri =
      '?' +
      Object.keys(search)
        .map((key) => key + '=' + search[key])
        .join('&');

    async function getElems() {
      try {
        const res = await api.get('/' + searchUri);
        setElems(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getElems();
  };

  if (!elems)
    return (
      <Container className="my-4">
        <ProgressBar variant="bg-danger" animated now={100} />
      </Container>
    );

  return (
    <Container className="my-3 results">
      <Row className="justify-content-md-center">
        <img src="../../beverages.jpg" className="img-fluid img-heading" alt="..." />
        <Col md="8" className="heading-text">
          <h2 className="fw-bold">NAPOJE</h2>
        </Col>
      </Row>
      <Row>
        <Col md="3" className="filters ">
          <form onSubmit={(e) => e.preventDefault()} onChange={(res) => handleSearch(res)}>
            <Row className="mt-3 mb-3">
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-0 fw-bold">NAZWA NAPOJU</Form.Label>
                  <Form.Control name="beverage_name" />
                </Form.Group>
              </Col>
            </Row>
          </form>
        </Col>
        <Col md="9">
          {elems.map((elem) => (
            <Col md="12" className="card-wrapper beverages" key={elem.id}>
              <hr />
              <div className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-auto">
                    <Link as={Link} to={`${elem.id}`}>
                      <img
                        src={elem.beverage_image_url}
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
                          {elem.beverage_name}
                        </Link>
                      </h5>
                      <p className="card-text">
                        <TextTruncate
                          line={2}
                          element="span"
                          truncateText="…"
                          text={elem.beverage_description}
                        />
                      </p>
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
