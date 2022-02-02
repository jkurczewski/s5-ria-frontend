import React from 'react';
import axios from 'axios';
import { Container, Row, Col, ProgressBar, Form } from 'react-bootstrap';
import TextTruncate from 'react-text-truncate';
import { Link } from 'react-router-dom';
import './lists.css';

const api = axios.create({
  baseURL: `http://localhost:8000/api/alcohols`,
});

export default function ListAlcohols() {
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
    if (e.target.name === 'alcohol_name' && e.target.value.length < 3) {
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
    event.preventDefault();
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
        <img src="../../alcohols.jpg" className="img-fluid img-heading" alt="..." />
        <Col md="8" className="heading-text">
          <h2 className="fw-bold">ALKOHOLE</h2>
        </Col>
      </Row>
      <Row>
        <Col md="3" className="filters">
          <form onSubmit={(e) => e.preventDefault()} onChange={(res) => handleSearch(res)}>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="mb-0 fw-bold">NAZWA ALKOHOLU</Form.Label>
                <Form.Control name="alcohol_name" />
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
            <Col md="12" className="card-wrapper alcohols" key={elem.id}>
              <hr />
              <div className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-auto">
                    <Link as={Link} to={`${elem.id}`}>
                      <img
                        src={elem.alcohol_image_url}
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
                          {elem.alcohol_name}
                        </Link>
                      </h5>
                      <div className="row">
                        <Col className="col-md-auto mt-1 ">
                          <small>{elem.alcohol_type}</small>
                        </Col>
                      </div>
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
