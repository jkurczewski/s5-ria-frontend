import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';

const api = axios.create({
  baseURL: `http://localhost:8000/api/`,
});

export default function DrinksForm() {
  const [newDrink, setNewDrink] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [selectedAlcohols, setSelectedAlcohols] = useState([]);
  const [selectedAdditions, setSelectedAdditions] = useState([]);
  const [selectedBeverages, setSelectedBeverages] = useState([]);

  const alcoholsList = [];
  const beveragesList = [];
  const additionsList = [];

  if (ingredients !== null) {
    Object.keys(ingredients.alcohols).forEach((key) =>
      alcoholsList.push({
        value: ingredients.alcohols[key].id,
        label: ingredients.alcohols[key].alcohol_name,
      }),
    );

    Object.keys(ingredients.beverages).forEach((key) =>
      beveragesList.push({
        value: ingredients.beverages[key].id,
        label: ingredients.beverages[key].beverage_name,
      }),
    );

    Object.keys(ingredients.additions).forEach((key) =>
      additionsList.push({
        value: ingredients.additions[key].id,
        label: ingredients.additions[key].addition_name,
      }),
    );
  }

  useEffect(() => {
    async function getElems() {
      try {
        const ingredients = await api.get('/ingredients');
        setIngredients(ingredients.data);
      } catch (err) {
        console.log(err);
      }
    }
    getElems();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    // api
    //   .post('/drinks', {
    //     name: e.target.name.value,
    //     description: e.target.description.value,
    //     recipe: e.target.description.value,
    //     alcohols: e.target.description.value,
    //     beverages: e.target.description.value,
    //     additions: e.target.description.value,
    //   })
    //   .then((response) => {
    //     setNewDrink(response.data);
    //   });
  }

  return (
    <Form onSubmit={(event) => handleSubmit(event)}>
      <Form.Group className="mb-3">
        <Form.Label>Nazwa</Form.Label>
        <Form.Control name="name" type="text" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Opis</Form.Label>
        <Form.Control name="description" as="textarea" rows={3} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Przepis</Form.Label>
        <Form.Control name="recipe" as="textarea" rows={3} />
      </Form.Group>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Zdjęcie</Form.Label>
        <Form.Control type="file" />
      </Form.Group>

      <hr />
      <h5>Składniki: </h5>

      <Form.Group>
        <Form.Label>Alkohole</Form.Label>
        <Select
          className="mb-3"
          options={alcoholsList}
          isMulti="true"
          onChange={setSelectedAlcohols}
        />
      </Form.Group>

      {selectedAlcohols.map((elem) => (
        <Row className="mb-1 d-flex align-items-center">
          <Col md="5">
            <h6>{elem.label}</h6>
          </Col>
          <Col>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control name="name" type="text" />
            </Form.Group>
          </Col>
          <Col md="3">
            <Form.Group>
              <Form.Select name="unit_type">
                <option key="ml" value="ml">
                  Mililitry
                </option>
                <option key="l" value="l">
                  Litry
                </option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Form.Group>
        <Form.Label>Napoje</Form.Label>
        <Select
          className="mb-3"
          options={beveragesList}
          name="beverages"
          isMulti="true"
          onChange={setSelectedBeverages}
        />
      </Form.Group>

      {selectedBeverages.map((elem) => (
        <Row className="mb-1 d-flex align-items-center">
          <Col md="5">
            <h6>{elem.label}</h6>
          </Col>
          <Col>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control name="name" type="text" />
            </Form.Group>
          </Col>
          <Col md="3">
            <Form.Group>
              <Form.Select name="unit_type">
                <option key="ml" value="ml">
                  Mililitry
                </option>
                <option key="l" value="l">
                  Litry
                </option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Form.Group>
        <Form.Label>Dodatki</Form.Label>
        <Select
          className="mb-3"
          options={additionsList}
          name="additions"
          isMulti="true"
          onChange={setSelectedAdditions}
        />
      </Form.Group>

      {selectedAdditions.map((elem) => (
        <Row className="mb-1 d-flex align-items-center">
          <Col md="5">
            <h6>{elem.label}</h6>
          </Col>
          <Col>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control name="name" type="text" />
            </Form.Group>
          </Col>
          <Col md="3">
            <Form.Group>
              <Form.Select name="unit_type">
                <option key="piece" value="piece">
                  Sztuka/i
                </option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Col className="d-flex justify-content-end">
        <Button className="mt-4" variant="primary" type="submit">
          Zatwierdź i dodaj
        </Button>
      </Col>
    </Form>
  );
}
