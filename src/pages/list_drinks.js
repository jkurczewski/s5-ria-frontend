import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  ProgressBar,
} from "react-bootstrap";
import TextTruncate from "react-text-truncate";
import { Link } from "react-router-dom";
import "./lists.css";
import Icons from "../components/icons";

const api = axios.create({
  baseURL: `http://localhost:8000/api/`,
});

function ListDrinks() {
  const [elems, setElems] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [search, setSearch] = useState(null);

  const getUri = () =>{
    const ret = [];
    for (let elem in search)
      if (search[elem] !== '') {
        ret.push(elem + '=' + search[elem]);
      }
    return ret.join('&');
  }


  useEffect(() => {
    if (search === null) {
      async function getElems() {
        try {
          const res = await api.get("/drinks");
          const ing_res = await api.get("/ingredients");
          setIngredients(ing_res.data);
          setElems(res.data);
        } catch (err) {
          console.log(err);
        }
      }
      getElems();
    }else{
      async function getElems() {
        try {
          const res = await api.get("/drinks?" + getUri());
          const ing_res = await api.get("/ingredients");
          setIngredients(ing_res.data);
          setElems(res.data);
        } catch (err) {
          console.log(err);
        }
      }
      getElems();
    }
    
  }, [search]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch( {...search, [event.target.name] : event.target.value} );
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
            <Col className="d-flex justify-content-end align-items-end">
              <Form.Group>
                <Form.Label>Nazwa drinka</Form.Label>
                <Form.Control name='name'/>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>
                  <span className="search_bar-ingredient">SKŁADNIKI</span>Nazwa
                  napoju
                </Form.Label>
                <Form.Select name='beverage_name'>
                  <option key="all" value="">Wszystkie</option>
                  {ingredients.beverages.map((bev) => (
                    <option key={bev.beverage_name} value={bev.beverage_name}>{bev.beverage_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>
                  <span className="search_bar-ingredient">SKŁADNIKI</span>Nazwa
                  dodatku
                </Form.Label>
                <Form.Select name='addition_name'>
                  <option key="all" value="">Wszystkie</option>
                  {ingredients.additions.map((bev) => (
                    <option key={bev.addition_name} value={bev.addition_name}>{bev.addition_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>
                  <span className="search_bar-ingredient">SKŁADNIKI</span>Nazwa
                  alkoholu
                </Form.Label>
                <Form.Select name='alcohol_name'>
                <option key="all" value="">Wszystkie</option>
                  {ingredients.alcohols.map((bev) => (
                    <option key={bev.alcohol_name} value={bev.alcohol_name}>{bev.alcohol_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>
                  <span className="search_bar-ingredient">SKŁADNIKI</span>Typ
                  alkoholu
                </Form.Label>
                <Form.Select name='alcohol_type'>
                  <option key="all" value="">Wszystkie</option>
                  <option key="gin" value="gin">Gin</option>
                  <option key="rum" value="rum">Rum</option>
                  <option key="whisky" value="whisky">Whisky</option>
                  <option key="vodka" value="vodka">Wódka</option>
                  <option key="tequila" value="tequila">Tequila</option>
                </Form.Select>
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
          <Col className="p-2" xs="6" md="4" lg="3" key={elem.id}>
            <Link as={Link} to={"" + elem.id}>
              <Card>
                <Card.Img
                  variant="top"
                  onError={(e) => {
                    e.target.onError = null;
                    e.target.src = "../320.png";
                  }}
                  src={elem.image_url}
                />
                <Icons ingredients={elem.ingredients} />
                <Card.Body>
                  <Card.Title>{elem.name}</Card.Title>
                  <Card.Text>
                    <TextTruncate
                      line={3}
                      element="span"
                      truncateText="…"
                      text={elem.description}
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

export default ListDrinks;
