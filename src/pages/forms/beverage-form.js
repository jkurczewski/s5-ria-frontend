import React, { useState } from 'react';
import { Form, Button, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: `http://localhost:8000/api/`,
});

export default function BeverageForm({ isProp, beverageId, beverageName, beverageFlavour }) {
  const [newBeverage, setnewBeverage] = useState({
    beverage_id: beverageId,
    beverage_name: beverageName,
    beverage_flavour: beverageFlavour,
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
      setnewBeverage(() => ({
        ...newBeverage,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setnewBeverage(() => ({
        ...newBeverage,
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

    if (!newBeverage.beverage_name) {
      errors.beverage_name = 'Nazwa jest wymagana';
    }

    if (!newBeverage.beverage_flavour) {
      errors.beverage_flavour = 'Smak jest wymagany';
    }

    if (newBeverage.beverage_image_url > 0) {
      if (newBeverage.beverage_image_url.size > 2480000) {
        errors.beverage_image_url = 'Zdjęcie może mieć max. 2MB';
      }

      if (isImage(newBeverage.beverage_image_url.name) === false) {
        errors.beverage_image_url = 'Obsługiwane formaty to: jpg, jpeg, png';
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

    if (validate(newBeverage)) {
      const formData = new FormData();

      if (newBeverage.beverage_image_url) {
        formData.append(
          'beverage_image_url',
          newBeverage.beverage_image_url,
          newBeverage.beverage_image_url.name,
        );
      }

      if (isProp) {
        let url = `beverages/${newBeverage.beverage_id}?`;

        Object.entries(newBeverage).forEach(([key, value]) => {
          if (key !== 'beverage_id') {
            if (key !== 'beverage_image_url') {
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
        let url = `beverages?`;

        Object.entries(newBeverage).forEach(([key, value]) => {
          if (key !== 'beverage_image_url') {
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
          defaultValue={newBeverage.beverage_name}
          name="beverage_name"
          type="text"
        />
        {formerrors.beverage_name && <p className="text-danger">{formerrors.beverage_name}</p>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="mb-0 fw-bold">
          Smak {isProp ? '' : <span className="text-danger">*</span>}
        </Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required={!isProp}
          defaultValue={newBeverage.beverage_flavour}
          name="beverage_flavour"
          type="text"
        />
        {formerrors.beverage_flavour && (
          <p className="text-danger">{formerrors.beverage_flavour}</p>
        )}
      </Form.Group>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label className="mb-0 fw-bold">
          Zdjęcie {isProp ? '' : <span className="text-danger">*</span>}
        </Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required={!isProp}
          name="beverage_image_url"
          type="file"
          accept=".png, .jpg, .jpeg"
        />
        {formerrors.beverage_image_url && (
          <p className="text-danger">{formerrors.beverage_image_url}</p>
        )}
      </Form.Group>

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
              <p>{newBeverage.beverage_name} - został zaktualizowany</p>
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
              <Modal.Title id="contained-modal-title-vcenter">Napój został dodany</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>{modalData ? modalData[1].beverage_name : ''}</h4>
              <p>
                Napój został dodany do listy. Możesz dodać kolejny lub przejść do nowo dodanego.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => navigate('/additions')}>
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
