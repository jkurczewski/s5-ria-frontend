import React from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Form
} from "react-bootstrap";
import TextTruncate from "react-text-truncate";
import { Link } from "react-router-dom";

const api = axios.create({
  baseURL: `http://localhost:8000/api/beverages`,
});

export default function ListBeverages() {
  const [elems, setElems] = React.useState(null);
  let search = [];

  React.useEffect(() => {
    async function getElems() {
      try {
        const res = await api.get("/");
        setElems(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getElems();
  }, []);

  const getSearch = (e) => {
    if (e.target.name === 'beverage_name' && e.target.value.length < 3) {
      return 
    }

    if (e.target.value === ""){
      const searchArr = search;
      delete searchArr[e.target.name];
    }else{
      search = {...search, [e.target.name] : e.target.value};
    }
  }


  const handleSearch = (event) => {
    getSearch(event)
    const searchUri = '?' + Object.keys(search).map(key => key + '=' + search[key]).join('&');
    
    async function getElems() {
      try {
        const res = await api.get("/" + searchUri);
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
        <ProgressBar animated now={100} />
      </Container>
    );

  return (
    <Container className="my-5 results">
      <Row>
        <Col>
          <h3>Wyszukiwarka</h3>
        </Col>
        <form onSubmit={(e) => e.preventDefault()} onChange={(res) => handleSearch(res)} >
          <Row className="mt-3 mb-3">
            <Col md="4" className="d-flex">
              <Form.Group className="d-flex flex-column w-100">
                <Form.Label>Nazwa napoju</Form.Label>
                <Form.Control name='beverage_name'/>
              </Form.Group>
            </Col>
          </Row>
        </form>
      </Row>
      <hr />
      <Row>
        <Col className="mt-3">
          <h3>
            Wyniki: <strong>{Object.keys(elems).length}</strong>
          </h3>
        </Col>
      </Row>
      <Row>
        {elems.map((elem) => (
          <Col className="p-2" xs="6" md="4" lg="3" xl="2" key={elem.id}>
            <Link as={Link} to={"" + elem.id}>
              <Card>
                <Card.Img
                  variant="top"
                  onError={(e) => {
                    e.target.onError = null;
                    e.target.src = "../320.png";
                  }}
                  src={elem.beverage_image_url}
                />
                <Card.Body>
                  <Card.Title>{elem.beverage_name}</Card.Title>
                  <Card.Text>
                    <TextTruncate
                      line={3}
                      element="span"
                      truncateText="…"
                      text={elem.beverage_description}
                    />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
