import React, { useState } from 'react';
import { Form, Button, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: `http://localhost:8000/api/`,
});

export default function AdditionForm({ isProp, additionId, additionName }) {
  const [newAddition, setnewAddition] = useState({
    addition_id: additionId,
    addition_name: additionName,
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
      setnewAddition(() => ({
        ...newAddition,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setnewAddition(() => ({
        ...newAddition,
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

    if (!newAddition.addition_name) {
      errors.addition_name = 'Nazwa jest wymagana';
    }

    if (newAddition.addition_image_url > 0) {
      if (newAddition.addition_image_url.size > 2480000) {
        errors.addition_image_url = 'Zdjęcie może mieć max. 2MB';
      }

      if (isImage(newAddition.addition_image_url.name) === false) {
        errors.addition_image_url = 'Obsługiwane formaty to: jpg, jpeg, png';
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

    if (validate(newAddition)) {
      const formData = new FormData();

      if (newAddition.addition_image_url) {
        formData.append(
          'addition_image_url',
          newAddition.addition_image_url,
          newAddition.addition_image_url.name,
        );
      }

      if (isProp) {
        let url = `additions/${newAddition.addition_id}?`;

        Object.entries(newAddition).forEach(([key, value]) => {
          if (key !== 'addition_id') {
            if (key !== 'addition_image_url') {
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
        let url = `additions?`;

        Object.entries(newAddition).forEach(([key, value]) => {
          if (key !== 'addition_image_url') {
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
        <Form.Label>Nazwa {isProp ? '' : <span className="text-danger">*</span>}</Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          defaultValue={newAddition.addition_name}
          required={!isProp}
          name="addition_name"
          type="text"
        />
        {formerrors.addition_name && <p className="text-danger">{formerrors.addition_name}</p>}
      </Form.Group>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Zdjęcie {isProp ? '' : <span className="text-danger">*</span>}</Form.Label>
        <Form.Control
          onChange={(e) => handleInput(e)}
          required={!isProp}
          name="addition_image_url"
          type="file"
        />
        {formerrors.addition_image_url && (
          <p className="text-danger">{formerrors.addition_image_url}</p>
        )}
      </Form.Group>

      {isProp ? (
        <>
          <Col className="d-flex justify-content-end">
            <Button className="mt-4" variant="primary" type="submit">
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
              <p>{newAddition.addition_name} - został zaktualizowany</p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" onClick={() => reload()}>
                Powrót
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          <Col className="d-flex justify-content-end">
            <Button className="mt-4" variant="primary" type="submit">
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
              <h4>{modalData ? modalData[1].addition_name : ''}</h4>
              <p>
                Dodatek został dodany do listy. Możesz dodać kolejny lub przejść do nowo dodanego.
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