import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlusCircle } from 'react-icons/fa';
import '../forms.css';

const api = axios.create({
  baseURL: `http://localhost:8000/api/`,
});

export default function AdditionForm({
  isProp,
  drinkId,
  drinkName,
  drinkDescription,
  drinkRecipe,
  alcoholsPropTemp,
  beveragesPropTemp,
  additionsPropTemp,
}) {
  const [newDrink, setNewDrink] = useState({
    id: drinkId,
    name: drinkName,
    description: drinkDescription,
    recipe: drinkRecipe,
  });
  const [ingredients, setIngredients] = useState(null);

  const alcoholsProp = [];
  const beveragesProp = [];
  const additionsProp = [];

  if (isProp) {
    alcoholsPropTemp.map((obj) =>
      alcoholsProp.push({
        alcohol_id: obj.alcohol_id,
        alcohol_name: obj.alcohol_id,
        alcohol_amount: obj.alcohol_amount,
        alcohol_unit: obj.alcohol_unit,
      }),
    );

    beveragesPropTemp.map((obj) =>
      beveragesProp.push({
        beverage_id: obj.beverage_id,
        beverage_name: obj.beverage_id,
        beverage_amount: obj.beverage_amount,
        beverage_unit: obj.beverage_unit,
      }),
    );

    additionsPropTemp.map((obj) =>
      additionsProp.push({
        addition_id: obj.addition_id,
        addition_name: obj.addition_id,
        addition_amount: obj.addition_amount,
        addition_unit: obj.addition_unit,
      }),
    );
  }

  const [alcohols, setAlcohols] = useState(
    isProp
      ? alcoholsProp
      : [{ alcohol_id: Date.now(), alcohol_name: '', alcohol_amount: '', alcohol_unit: 'ml' }],
  );

  const [beverages, setBeverages] = useState(
    isProp
      ? beveragesProp
      : [{ beverage_id: Date.now(), beverage_name: '', beverage_amount: '', beverage_unit: 'ml' }],
  );
  const [additions, setAdditions] = useState(
    isProp
      ? additionsProp
      : [
          {
            addition_id: Date.now(),
            addition_name: '',
            addition_amount: '',
            addition_unit: 'piece',
          },
        ],
  );

  const [formerrors, setFormErrors] = useState({});

  const [modalShow, setModalShow] = useState(false);
  const [addedModalShow, setAddedModalShow] = useState(false);
  const [modalData, setModalData] = useState(([1].name = ''));

  const alcoholsList = [];
  const beveragesList = [];
  const additionsList = [];

  const navigate = useNavigate();
  const reload = () => {
    window.scrollTo(0, 0);
    window.location.reload();
  };

  if (ingredients !== null) {
    Object.keys(ingredients.alcohols).forEach((key) =>
      alcoholsList.push({
        value: ingredients.alcohols[key].id,
        label: ingredients.alcohols[key].alcohol_name,
        type: ingredients.alcohols[key].alcohol_type,
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
        setAlcohols([
          ...alcohols,
          { alcohol_id: Date.now(), alcohol_name: '', alcohol_amount: '', alcohol_unit: 'ml' },
        ]);
        break;
      case 'beverage':
        setBeverages([
          ...beverages,
          { beverage_id: Date.now(), beverage_name: '', beverage_amount: '', beverage_unit: 'ml' },
        ]);
        break;
      case 'addition':
        setAdditions([
          ...additions,
          {
            addition_id: Date.now(),
            addition_name: '',
            addition_amount: '',
            addition_unit: 'piece',
          },
        ]);
        break;

      default:
        break;
    }
  };

  const removeElem = (i, type) => {
    const newAlcoholRemove = [...alcohols];
    const newBeverageRemove = [...beverages];
    const newDrinkRemove = [...additions];

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
        newDrinkRemove.splice(i, 1);
        setAdditions(newDrinkRemove);
        break;

      default:
        break;
    }
  };

  const isImage = (name) => {
    const ext = ['.jpg', '.jpeg', '.png'];
    return ext.some((el) => name.endsWith(el));
  };

  const hasDefaultValue = (list) => {
    let state = false;
    const ifHas = (obj) =>
      Object.values(obj).indexOf('', 'default'.toLowerCase()) >= 0
        ? (state = true)
        : (state = false);
    list.map(ifHas);
    return state;
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

    if (hasDefaultValue(beverages)) {
      errors.beverages = 'Wszystkie wartości muszą zostać uzupełnione';
    }

    if (hasDefaultValue(additions)) {
      errors.additions = 'Wszystkie wartości muszą zostać uzupełnione';
    }

    if (alcohols.length > 0) {
      if (hasDefaultValue(alcohols)) {
        errors.alcohols = 'Wszystkie wartości muszą zostać uzupełnione';
      }
    }
    if (newDrink.image_url > 0) {
      if (newDrink.image_url.size > 2480000) {
        errors.image_url = 'Zdjęcie może mieć max. 2MB';
      }

      if (isImage(newDrink.image_url.name) === false) {
        errors.image_url = 'Obsługiwane formaty to: jpg, jpeg, png';
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      return true;
    }

    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validate(newDrink);

    if (validate(newDrink)) {
      let alcoholsUrl = '';
      let beveragesUrl = '';
      let additionsUrl = '';

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

      if (newDrink.image_url) {
        formData.append('image_url', newDrink.image_url, newDrink.image_url.name);
      }
      if (isProp) {
        let url = `drinks/${newDrink.id}?name=${newDrink.name}&description=${newDrink.description}&recipe=${newDrink.recipe}`;

        if (beveragesUrl) {
          url = url.concat(`&beverages=${beveragesUrl}`);
        }
        if (additionsUrl) {
          url = url.concat(`&additions=${additionsUrl}`);
        }
        if (alcoholsUrl) {
          url = url.concat(`&alcohols=${alcoholsUrl}`);
        }

        api
          .patch(url, formData, {
            headers: {
              'content-type': 'multipart/form-data',
            },
          })
          .then((res) => {
            console.log(res.data);
            setAddedModalShow(true);
          })
          .catch((err) => console.log(err));
      } else {
        let url = `drinks?name=${newDrink.name}&description=${newDrink.description}&recipe=${newDrink.recipe}`;
        if (beveragesUrl) {
          url = url.concat(`&beverages=${beveragesUrl}`);
        }
        if (additionsUrl) {
          url = url.concat(`&additions=${additionsUrl}`);
        }
        if (alcoholsUrl) {
          url = url.concat(`&alcohols=${alcoholsUrl}`);
        }

        api
          .post(url, formData, {
            headers: {
              'content-type': 'multipart/form-data',
            },
          })
          .then((res) => {
            console.log(res.data);
            setModalData(res.data);
            setModalShow(true);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <Form onSubmit={(event) => handleSubmit(event)}>
      <Form.Group className="mb-3">
        <Form.Label className="mb-0 fw-bold">
          Nazwa {isProp ? '' : <span className="text-danger">*</span>}
        </Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required={!isProp}
          defaultValue={newDrink.name}
          name="name"
          type="text"
        />
        {formerrors.name && <p className="text-danger">{formerrors.name}</p>}
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label className="mb-0 fw-bold">
          Opis {isProp ? '' : <span className="text-danger">*</span>}
        </Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required={!isProp}
          defaultValue={newDrink.description}
          name="description"
          as="textarea"
          rows={3}
        />
        {formerrors.description && <p className="text-danger">{formerrors.description}</p>}
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label className="mb-0 fw-bold">
          Przepis {isProp ? '' : <span className="text-danger">*</span>}
        </Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required={!isProp}
          defaultValue={newDrink.recipe}
          name="recipe"
          as="textarea"
          rows={3}
        />
        {formerrors.recipe && <p className="text-danger">{formerrors.recipe}</p>}
      </Form.Group>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label className="mb-0 fw-bold">
          Zdjęcie {isProp ? '' : <span className="text-danger">*</span>}
        </Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required={!isProp}
          name="image_url"
          type="file"
        />
        {formerrors.image_url && <p className="text-danger">{formerrors.image_url}</p>}
      </Form.Group>

      <h4>Składniki: </h4>
      <h5 className="mt-4">Alkohole:</h5>
      <Table className="mb-2">
        <thead>
          <tr>
            <th>Nazwa alkoholu</th>
            <th>Ilość</th>
            <th>Jednostka</th>
          </tr>
        </thead>
        <tbody>
          {alcohols.map((element, index) => (
            <tr key={element.alcohol_id}>
              <td className="w-50">
                <Form.Group>
                  <Form.Select
                    name="alcohol_name"
                    onChange={(e) => handleElemChange(index, e, 'alcohol')}
                    required={!isProp}
                    value={
                      alcohols[index].alcohol_name === '' ? 'default' : alcohols[index].alcohol_name
                    }
                  >
                    <option disabled key="default" value="default">
                      Wybierz alkohol
                    </option>
                    {alcoholsList.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.type} - {e.label}
                      </option>
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
                    required={!isProp}
                    defaultValue={isProp ? element.alcohol_amount : ''}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Select
                    onChange={(e) => handleElemChange(index, e, 'alcohol')}
                    name="alcohol_unit"
                    defaultValue={isProp ? element.alcohol_unit : 'ml'}
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
              <td className="icon-wrapper">
                <button type="button" onClick={() => removeElem(index, 'alcohol')}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {formerrors.alcohols && <p className="text-danger">{formerrors.alcohols}</p>}
      <Col className="d-flex add-button">
        <Button size="sm" onClick={() => addElem('alcohol')}>
          <FaPlusCircle />
          Dodaj nowy alkohol
        </Button>
      </Col>

      <h5 className="mt-4">Napoje:</h5>
      <Table>
        <thead>
          <tr>
            <th>Nazwa napoju</th>
            <th>Ilość</th>
            <th>Jednostka</th>
          </tr>
        </thead>
        <tbody>
          {beverages.map((element, index) => (
            <tr key={element.beverage_id}>
              <td className="w-50">
                <Form.Group>
                  <Form.Select
                    name="beverage_name"
                    onChange={(e) => handleElemChange(index, e, 'beverage')}
                    required={!isProp}
                    value={
                      beverages[index].beverage_name === ''
                        ? 'default'
                        : beverages[index].beverage_name
                    }
                  >
                    <option disabled key="default" value="default">
                      Wybierz napój
                    </option>
                    {beveragesList.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
                      </option>
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
                    required={!isProp}
                    defaultValue={isProp ? element.beverage_amount : ''}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Select
                    onChange={(e) => handleElemChange(index, e, 'beverage')}
                    name="beverage_unit"
                    defaultValue={isProp ? element.beverage_unit : 'ml'}
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
              <td className="icon-wrapper">
                <button type="button" onClick={() => removeElem(index, 'beverage')}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {formerrors.beverages && <p className="text-danger">{formerrors.beverages}</p>}
      <Col className="d-flex add-button">
        <Button size="sm" onClick={() => addElem('beverage')}>
          <FaPlusCircle />
          Dodaj nowy napój
        </Button>
      </Col>

      <h5 className="mt-4">Dodatki:</h5>
      <Table>
        <thead>
          <tr>
            <th>Nazwa dodatku</th>
            <th>Ilość</th>
            <th>Jednostka</th>
          </tr>
        </thead>
        <tbody>
          {additions.map((element, index) => (
            <tr key={element.addition_id}>
              <td className="w-50">
                <Form.Group>
                  <Form.Select
                    name="addition_name"
                    onChange={(e) => handleElemChange(index, e, 'addition')}
                    required={!isProp}
                    value={
                      additions[index].addition_name === ''
                        ? 'default'
                        : additions[index].addition_name
                    }
                  >
                    <option disabled key="default" value="default">
                      Wybierz dodatek
                    </option>
                    {additionsList.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.label}
                      </option>
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
                    required={!isProp}
                    defaultValue={isProp ? element.addition_amount : ''}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group>
                  <Form.Select
                    onChange={(e) => handleElemChange(index, e, 'addition')}
                    name="addition_unit"
                    defaultValue={isProp ? element.addition_unit : 'Sztuka/i'}
                  >
                    <option key="Sztuka/i" value="Sztuka/i">
                      Sztuka/i
                    </option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td className="icon-wrapper">
                <button type="button" onClick={() => removeElem(index, 'addition')}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {formerrors.additions && <p className="text-danger">{formerrors.additions}</p>}
      <Col className="d-flex add-button">
        <Button size="sm" onClick={() => addElem('addition')}>
          <FaPlusCircle />
          Dodaj nowy dodatek
        </Button>
      </Col>

      {isProp ? (
        <>
          <Col className="d-flex justify-content-end">
            <Button className="mt-4" variant="danger" type="submit">
              Zatwierdź
            </Button>
          </Col>
          <Modal
            show={addedModalShow}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
          >
            <Modal.Header>
              <Modal.Title>Edycja zakończona poprawnie</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>{newDrink.name} - został zaktualizowany</p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={() => reload()}>
                Powrót
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          <Col className="d-flex justify-content-end">
            <Button className="mt-4" variant="danger" type="submit">
              Dodaj
            </Button>
          </Col>
          <Modal
            show={modalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
          >
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">Dodatek został dodany</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>{modalData ? modalData[1].name : ''}</h4>
              <p>
                Dodatek został dodany do listy. Możesz dodać kolejny lub przejść do nowo dodanego.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => navigate('/drinks')}>
                Powrót do listy
              </Button>
              <Button
                onClick={() => {
                  setModalShow(false);
                  reload();
                }}
              >
                Dodaj nowy
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Form>
  );
}
