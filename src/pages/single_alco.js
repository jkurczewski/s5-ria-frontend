import React from "react";
import { Container, ProgressBar, Row, Col, Image, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: `http://localhost:8000/api/alcohols/`,
  });
  
function SingleAlcohol() {
    const [elem, setElem] = React.useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
  
    React.useEffect(() => {
      async function getElem() {
        try {
          const res = await api.get("/" + id);
          setElem(res.data);
        } catch (err) {
          console.log(err);
        }
      }
      getElem();
    }, []);
  
    async function deleteElem() {
      try {
          await api.delete("/" + id);
          alert(elem[0].alcohol_name + " został usunięty!");
          setElem(null);
          navigate("/alcohols");
  
      } catch (error) {
          alert("Podczas usuwania wystąpił błąd");
          console.log(error)
      }
    }

    console.log(elem);
  
    if (!elem)
      return (
        <Container className="my-4">
          <ProgressBar animated now={100} />
        </Container>
      );
  
    return (
      <Container className="my-5">
        <Row>
          <Col>
            <Link className="btn btn-outline-dark" as={Link} to={"/alcohols"}>
              Powrót do listy
            </Link>
          </Col>
          <Col className="d-flex justify-content-end">
              <Button className="btn btn-Info mx-3" >Edytuj</Button>
              <Button className="btn btn-danger" onClick={deleteElem}>Usuń</Button>
          </Col>
        </Row>
        <Row className="my-4">
          <Col xs="3">
            <Image
              src={elem[0].alcohol_image_url}
              fluid={true}
              onError={(e) => {
                e.target.onError = null;
                e.target.src = "../320.png";
              }}
            />
          </Col>
          <Col xs="9">
            <h1>{elem[0].alcohol_name}</h1>
            <hr />
            <Row>
                <Col md="6">
                    <h5>Typ</h5>
                    <p>{elem[0].alcohol_type}</p>
                    <h5>Moc</h5>
                    <p>{elem[0].alcohol_strength}</p>
                </Col>
                <Col md="6">
                    <h5>Sensoryka</h5>
                    <span><strong>Zapach</strong></span> <p>{elem[0].alcohol_profile_smell}</p>
                    <span><strong>Smak</strong></span> <p>{elem[0].alcohol_profile_taste}</p>
                    <span><strong>Finish</strong></span> <p>{elem[0].alcohol_profile_finish}</p>
                </Col>
            </Row>

          </Col>
          <Col xs="12" className="mt-4">
              <h2>Powiązane drinki</h2>
              <Row>
              {elem.related_drinks.map((el) => (
                <Col className="p-2" xs="6" md="3" lg="2" key={el.drink_id}>
                  <Link as={Link} to={"/drinks/" + el.drink_id}>
                    <Card>
                      <Card.Img
                        variant="top"
                        onError={(e) => {
                          e.target.onError = null;
                          e.target.src = "../320.png";
                        }}
                        src={el.image_url}
                      />
                      <Card.Body>
                        <Card.Title>{el.name}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
  
  export default SingleAlcohol;