import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Table } from 'react-bootstrap';
import axios from 'axios';

const api = axios.create({
  baseURL: `http://localhost:8000/api/`,
});

export default function DrinksForm() {
  const [newDrink, setNewDrink] = useState([]);
  const [ingredients, setIngredients] = useState(null);

  const [alcohols, setAlcohols] = useState([
    { alcohol_name: '', alcohol_amount: '', alcohol_unit: 'ml' },
  ]);
  const [beverages, setBeverages] = useState([
    { beverage_name: '', beverage_amount: '', beverage_unit: 'ml' },
  ]);
  const [additions, setAdditions] = useState([
    { addition_name: '', addition_amount: '', addition_unit: 'piece' },
  ]);

  const [formerrors, setFormErrors] = useState({});

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
        const res = await api.get('/ingredients');
        setIngredients(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getElems();
  }, []);

  const handleInput = (e) => {
    if (e.target.type === 'file') {
      setNewDrink(() => ({
        ...newDrink,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setNewDrink(() => ({
        ...newDrink,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleElemChange = (i, e, type) => {
    const newAlcohol = [...alcohols];
    const newBeverage = [...beverages];
    const newAddition = [...additions];

    switch (type) {
      case 'alcohol':
        newAlcohol[i][e.target.name] = e.target.value;
        setAlcohols(newAlcohol);
        break;
      case 'beverage':
        newBeverage[i][e.target.name] = e.target.value;
        setBeverages(newBeverage);
        break;
      case 'addition':
        newAddition[i][e.target.name] = e.target.value;
        setAdditions(newAddition);
        break;

      default:
        break;
    }
  };

  const addElem = (type) => {
    switch (type) {
      case 'alcohol':
        setAlcohols([...alcohols, { alcohol_name: '', alcohol_amount: '', alcohol_unit: 'ml' }]);
        break;
      case 'beverage':
        setBeverages([
          ...beverages,
          { beverage_name: '', beverage_amount: '', beverage_unit: 'ml' },
        ]);
        break;
      case 'addition':
        setAdditions([
          ...additions,
          { addition_name: '', addition_amount: '', addition_unit: 'piece' },
        ]);
        break;

      default:
        break;
    }
  };

  const removeElem = (i, type) => {
    const newAlcoholRemove = [...alcohols];
    const newBeverageRemove = [...beverages];
    const newAdditionRemove = [...additions];

    switch (type) {
      case 'alcohol':
        newAlcoholRemove.splice(i, 1);
        setAlcohols(newAlcoholRemove);
        break;
      case 'beverage':
        newBeverageRemove.splice(i, 1);
        setBeverages(newBeverageRemove);
        break;
      case 'addition':
        newAdditionRemove.splice(i, 1);
        setAdditions(newAdditionRemove);
        break;

      default:
        break;
    }
  };

  const validate = () => {
    const errors = {};

    if (!newDrink.name) {
      errors.name = 'Nazwa jest wymagana';
    }

    if (!newDrink.description) {
      errors.description = 'Opis jest wymagany';
    }

    if (!newDrink.recipe) {
      errors.recipe = 'Opis jest wymagany';
    }

    // if (!selectedBeverages) {
    //   errors.beverages = 'Napoje są wymagane';
    // }

    // if (!selectedAdditions) {
    //   errors.addiitons = 'Dodatki są wymagane';
    // }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      return true;
    }

    return false;
  };

  console.log(additions);

  const handleSubmit = (e) => {
    console.log(newDrink);
    e.preventDefault();
    validate(newDrink);

    let alcoholsUrl = '';
    let beveragesUrl = '&beverages=';
    let additionsUrl = '&additions=';

    alcohols.map(
      (elem) =>
        (alcoholsUrl = alcoholsUrl.concat(
          `${elem.alcohol_name}-${elem.alcohol_unit}-${elem.alcohol_amount},`,
        )),
    );

    if (alcoholsUrl.substring(alcoholsUrl.length - 1) === ',') {
      alcoholsUrl = alcoholsUrl.substring(0, alcoholsUrl.length - 1);
    }

    beverages.map(
      (elem) =>
        (beveragesUrl = beveragesUrl.concat(
          `${elem.beverage_name}-${elem.beverage_unit}-${elem.beverage_amount},`,
        )),
    );

    if (beveragesUrl.substring(beveragesUrl.length - 1) === ',') {
      beveragesUrl = beveragesUrl.substring(0, beveragesUrl.length - 1);
    }

    additions.map(
      (elem) =>
        (additionsUrl = additionsUrl.concat(
          `${elem.addition_name}-${elem.addition_unit}-${elem.addition_amount},`,
        )),
    );

    if (additionsUrl.substring(additionsUrl.length - 1) === ',') {
      additionsUrl = additionsUrl.substring(0, additionsUrl.length - 1);
    }

    const formData = new FormData();
    formData.append('image', newDrink.image_url, newDrink.image_url.name);

    let url = `drinks?name=${newDrink.name}&description=${newDrink.description}&recipe=${newDrink.recipe}`;

    if (alcoholsUrl) {
      url += `${url}&alcohols=${alcoholsUrl}`;
    }

    api
      .post(url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Form onSubmit={(event) => handleSubmit(event)}>
      <Form.Group className="mb-3">
        <Form.Label>
          Nazwa <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control onChange={(e) => handleInput(e)} required name="name" type="text" />
        {formerrors.name && <p className="text-danger">{formerrors.name}</p>}
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>
          Opis <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required
          name="description"
          as="textarea"
          rows={3}
        />
        {formerrors.description && <p className="text-danger">{formerrors.description}</p>}
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>
          Przepis <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required
          name="recipe"
          as="textarea"
          rows={3}
        />
        {formerrors.recipe && <p className="text-danger">{formerrors.recipe}</p>}
      </Form.Group>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>
          Zdjęcie <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control onChange={(e) => handleInput(e)} required name="image_url" type="file" />
        {formerrors.image_url && <p className="text-danger">{formerrors.image_url}</p>}
      </Form.Group>

      <hr />
      <h4>Składniki: </h4>
      <h5 className="mt-4">Alkohole:</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nazwa alkoholu</th>
            <th>Ilość</th>
            <th>Jednostka</th>
          </tr>
        </thead>
        <tbody>
          {alcohols.map((element, index) => (
            <tr key={element}>
              <td className="w-50">
                <Form.Group>
                  <Form.Select
                    name="alcohol_name"
                    onChange={(e) => handleElemChange(index, e, 'alcohol')}
                    required
                    defaultValue="default"
                  >
                    <option disabled key="default" value="default">
                      Wybierz alkohol
                    </option>
                    {alcoholsList.map((e) => (
                      <option value={e.value}>{e.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Control
                    onChange={(e) => handleElemChange(index, e, 'alcohol')}
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    name="alcohol_amount"
                    type="text"
                    required
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Select
                    onChange={(e) => handleElemChange(index, e, 'alcohol')}
                    name="alcohol_unit"
                    defaultValue="ml"
                  >
                    <option key="ml" value="ml">
                      ml
                    </option>
                    <option key="l" value="l">
                      l
                    </option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <Button variant="secondary" size="sm" onClick={() => removeElem(index, 'alcohol')}>
                  Usuń
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" size="sm" onClick={() => addElem('alcohol')}>
        Dodaj nowy alkohol
      </Button>

      <h5 className="mt-4">Napoje:</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nazwa napoju</th>
            <th>Ilość</th>
            <th>Jednostka</th>
          </tr>
        </thead>
        <tbody>
          {beverages.map((element, index) => (
            <tr key={element}>
              <td className="w-50">
                <Form.Group>
                  <Form.Select
                    name="beverage_name"
                    onChange={(e) => handleElemChange(index, e, 'beverage')}
                    required
                    defaultValue="default"
                  >
                    <option disabled key="default" value="default">
                      Wybierz napój
                    </option>
                    {beveragesList.map((e) => (
                      <option value={e.value}>{e.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Control
                    onChange={(e) => handleElemChange(index, e, 'beverage')}
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    name="beverage_amount"
                    type="text"
                    required
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Select
                    onChange={(e) => handleElemChange(index, e, 'beverage')}
                    name="beverage_unit"
                    defaultValue="ml"
                  >
                    <option key="ml" value="ml">
                      ml
                    </option>
                    <option key="l" value="l">
                      l
                    </option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <Button variant="secondary" size="sm" onClick={() => removeElem(index, 'beverage')}>
                  Usuń
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" size="sm" onClick={() => addElem('beverage')}>
        Dodaj nowy napój
      </Button>

      <h5 className="mt-4">Dodatki:</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nazwa dodatku</th>
            <th>Ilość</th>
            <th>Jednostka</th>
          </tr>
        </thead>
        <tbody>
          {additions.map((element, index) => (
            <tr key={element}>
              <td className="w-50">
                <Form.Group>
                  <Form.Select
                    name="aaddition_name"
                    onChange={(e) => handleElemChange(index, e, 'addition')}
                    required
                    defaultValue="default"
                  >
                    <option disabled key="default" value="default">
                      Wybierz dodatek
                    </option>
                    {additionsList.map((e) => (
                      <option value={e.value}>{e.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Control
                    onChange={(e) => handleElemChange(index, e, 'addition')}
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    name="addition_amount"
                    type="text"
                    required
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Select
                    onChange={(e) => handleElemChange(index, e, 'addition')}
                    name="addition_unit"
                    defaultValue="ml"
                  >
                    <option key="ml" value="ml">
                      ml
                    </option>
                    <option key="l" value="l">
                      l
                    </option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <Button variant="secondary" size="sm" onClick={() => removeElem(index, 'addition')}>
                  Usuń
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" size="sm" onClick={() => addElem('addition')}>
        Dodaj nowy dodatek
      </Button>

      <Col className="d-flex justify-content-end">
        <Button className="mt-4" variant="primary" type="submit">
          Dodaj
        </Button>
      </Col>
    </Form>
  );
}
