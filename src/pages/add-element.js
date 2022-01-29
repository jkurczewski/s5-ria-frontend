import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import DrinksForm from './forms/drinks-form';

export default function AddElement() {
  const [state, setState] = useState('drinks');
  const [form, setForm] = useState('');

  // const AlcoholsForm = () => {
  //   return <span>AlcoholsForm</span>;
  // };

  // const BeveresForm = () => {
  //   return <span>BeveresForm</span>;
  // };

  // const AdditionsForm = () => {
  //   return <span>AdditionsForm</span>;
  // };

  useEffect(() => {
    const RenderType = () => {
      switch (state) {
        case 'drinks':
          setForm(<DrinksForm />);
          break;

        // case 'alcohols':
        //   setForm(<AlcoholsForm />);
        //   break;

        // case 'beverages':
        //   setForm(<BeveresForm />);
        //   break;

        // case 'additions':
        //   setForm(<AdditionsForm />);
        //   break;

        default:
      }
    };
    RenderType();
  }, [state]);

  return (
    <Container className="mt-5">
      <Row className="d-flex flex-row justify-content-center">
        <Col md="8">
          <h1>Dodaj do bazy danych</h1>
        </Col>
        <Col md="8" className="mb-2">
          <form onSubmit={(e) => e.preventDefault()} onChange={(e) => setState(e.target.value)}>
            <Row className="mt-3 mb-3">
              <Col className="">
                <Form.Group className="d-flex flex-column w-100">
                  <Form.Label>Wybierz typ dodawanego elementu:</Form.Label>
                  <Form.Select name="adding_type">
                    <option key="drinks" value="drinks">
                      Drink
                    </option>
                    <option key="alcohols" value="alcohols">
                      Alkohol
                    </option>
                    <option key="beverages" value="beverages">
                      Napoje
                    </option>
                    <option key="additions" value="additions">
                      Dodatki
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </form>
        </Col>
        <Col md="8">
          <hr />
        </Col>

        <Col md="8" className="mt-2">
          {form}
        </Col>
      </Row>
    </Container>
  );
}
