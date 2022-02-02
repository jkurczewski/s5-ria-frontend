import React, { useState } from 'react';
import { Form, Button, Col, Modal, Row, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: `http://localhost:8000/api/`,
});

export default function DrinksForm({
  isProp,
  additionId,
  alcoholName,
  alcoholType,
  alcoholStrength,
  alcoholProfileSmell,
  alcoholProfileTaste,
  alcoholProfileFinish,
}) {
  const [newAlcohol, setnewAlcohol] = useState({
    alcohol_id: additionId,
    alcohol_name: alcoholName,
    alcohol_type: alcoholType,
    alcohol_strength: alcoholStrength,
    alcohol_profile_smell: alcoholProfileSmell,
    alcohol_profile_taste: alcoholProfileTaste,
    alcohol_profile_finish: alcoholProfileFinish,
  });

  const [formerrors, setFormErrors] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [addedModalShow, setAddedModalShow] = useState(false);
  const [modalData, setModalData] = useState(([1].name = ''));

  const navigate = useNavigate();
  const reload = () => {
    window.scrollTo(0, 0);
    window.location.reload();
  };

  const handleInput = (e) => {
    if (e.target.type === 'file') {
      setnewAlcohol(() => ({
        ...newAlcohol,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setnewAlcohol(() => ({
        ...newAlcohol,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const isImage = (name) => {
    const ext = ['.jpg', '.jpeg', '.png'];
    return ext.some((el) => name.endsWith(el));
  };

  const validate = () => {
    const errors = {};

    console.log(newAlcohol);

    if (!newAlcohol.alcohol_name) {
      errors.alcohol_name = 'Nazwa jest wymagana';
    }

    if (!newAlcohol.alcohol_type) {
      errors.alcohol_type = 'Typ alkoholu jest wymagany';
    }

    if (!newAlcohol.alcohol_strength) {
      errors.alcohol_type = 'Moc alkoholu jest wymagana';
    }

    if (!newAlcohol.alcohol_profile_smell) {
      errors.alcohol_type = 'Zapach jest wymagany';
    }

    if (!newAlcohol.alcohol_profile_taste) {
      errors.alcohol_type = 'Smak jest wymagany';
    }

    if (!newAlcohol.alcohol_profile_finish) {
      errors.alcohol_type = 'Wykończenie jest wymagane';
    }

    if (newAlcohol.alcohol_image_url > 0) {
      if (newAlcohol.alcohol_image_url.size > 2480000) {
        errors.alcohol_image_url = 'Zdjęcie może mieć max. 2MB';
      }

      if (isImage(newAlcohol.alcohol_image_url.name) === false) {
        errors.alcohol_image_url = 'Obsługiwane formaty to: jpg, jpeg, png';
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
    validate(newAlcohol);

    const formData = new FormData();

    if (newAlcohol.alcohol_image_url) {
      formData.append(
        'alcohol_image_url',
        newAlcohol.alcohol_image_url,
        newAlcohol.alcohol_image_url.name,
      );
    }

    if (isProp) {
      let url = `alcohols/${newAlcohol.alcohol_id}?`;

      Object.entries(newAlcohol).forEach(([key, value]) => {
        if (key !== 'alcohol_id') {
          if (key !== 'alcohol_image_url') {
            url = url.concat(`${key}=${value}&`);
          }
        }
      });

      if (url.substring(url.length - 1) === '&') url = url.substring(0, url.length - 1);

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
      let url = `alcohols?`;

      Object.entries(newAlcohol).forEach(([key, value]) => {
        if (key !== 'alcohol_image_url') {
          url = url.concat(`${key}=${value}&`);
        }
      });

      if (url.substring(url.length - 1) === '&') url = url.substring(0, url.length - 1);
      api
        .post(url, formData, {
          headers: {
            'content-type': 'multipart/form-data',
          },
        })
        .then((res) => {
          setModalData(res.data);
          setModalShow(true);
        })
        .catch((err) => console.log(err));
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
          name="alcohol_name"
          defaultValue={newAlcohol.alcohol_name}
          type="text"
        />
        {formerrors.alcohol_name && <p className="text-danger">{formerrors.alcohol_name}</p>}
      </Form.Group>
      <Row>
        <Col md="6" className="mb-3">
          <Form.Group>
            <Form.Label className="mb-0 fw-bold">
              Typ alkoholu {isProp ? '' : <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Select
              name="alcohol_type"
              defaultValue={isProp ? newAlcohol.alcohol_type : 'default'}
              onChange={(e) => handleInput(e)}
            >
              <option disabled key="default" value="default">
                Wybierz typ alkoholu
              </option>
              <option key="vodka" value="vodka">
                Wódka
              </option>
              <option key="gin" value="gin">
                Gin
              </option>
              <option key="rum" value="rum">
                Rum
              </option>
              <option key="tequila" value="tequila">
                Tequila
              </option>
              <option key="whisky" value="whisky">
                Whisky
              </option>
              <option key="brandy" value="brandy">
                Brandy
              </option>
              <option key="liqueur" value="liqueur">
                Likier
              </option>
              <option key="vine" value="vine">
                Wino
              </option>
              <option key="beer" value="beer">
                Piwo
              </option>
              <option key="bitters" value="bitters">
                Bittersy koktajlowe
              </option>
            </Form.Select>
            {formerrors.alcohol_type && <p className="text-danger">{formerrors.alcohol_type}</p>}
          </Form.Group>
        </Col>
        <Col md="6">
          <Form.Label className="mb-0 fw-bold">
            Moc alkoholu {isProp ? '' : <span className="text-danger">*</span>}
          </Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              onChange={(e) => handleInput(e)}
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              name="alcohol_strength"
              type="text"
              required={!isProp}
              defaultValue={newAlcohol.alcohol_strength}
            />
            <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
          </InputGroup>
          {formerrors.alcohol_strength && (
            <p className="text-danger">{formerrors.alcohol_strength}</p>
          )}
        </Col>
      </Row>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label className="mb-0 fw-bold">
          Zdjęcie {isProp ? '' : <span className="text-danger">*</span>}
        </Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required={!isProp}
          name="alcohol_image_url"
          type="file"
        />
        {formerrors.alcohol_image_url && (
          <p className="text-danger">{formerrors.alcohol_image_url}</p>
        )}
      </Form.Group>

      <Row>
        <Col md="12">
          <h4>Sensoryka</h4>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Label className="mb-0 fw-bold">
              Zapach {isProp ? '' : <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              onChange={(e) => handleInput(e)}
              required={!isProp}
              name="alcohol_profile_smell"
              as="textarea"
              rows={3}
              defaultValue={newAlcohol.alcohol_profile_smell}
            />
            {formerrors.alcohol_profile_smell && (
              <p className="text-danger">{formerrors.alcohol_profile_smell}</p>
            )}
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label className="mb-0 fw-bold">
              Smak {isProp ? '' : <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              onChange={(e) => handleInput(e)}
              required={!isProp}
              name="alcohol_profile_taste"
              as="textarea"
              rows={3}
              defaultValue={newAlcohol.alcohol_profile_taste}
            />
            {formerrors.alcohol_profile_taste && (
              <p className="text-danger">{formerrors.alcohol_profile_taste}</p>
            )}
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label className="mb-0 fw-bold">
              Wykończenie (finish) {isProp ? '' : <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              onChange={(e) => handleInput(e)}
              required={!isProp}
              name="alcohol_profile_finish"
              as="textarea"
              rows={3}
              defaultValue={newAlcohol.alcohol_profile_finish}
            />
            {formerrors.alcohol_profile_finish && (
              <p className="text-danger">{formerrors.alcohol_profile_finish}</p>
            )}
          </Form.Group>
        </Col>
      </Row>

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
              <p>{newAlcohol.alcohol_name} - został zaktualizowany</p>
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
              <h4>{modalData ? modalData[1].alcohol_name : ''}</h4>
              <p>
                Dodatek został dodany do listy. Możesz dodać kolejny lub przejść do nowo dodanego.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => navigate('/alcohols')}>
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
