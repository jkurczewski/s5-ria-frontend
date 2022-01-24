import React from "react";
import { Container, ProgressBar, Row, Col, Image, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, Link, useNavigate, Route } from "react-router-dom";


const api = axios.create({
  baseURL: `http://localhost:8000/api/drinks/`,
});

function SingleDrink() {
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
        alert(elem[0].name + " został usunięty!");
        setElem(null);
        navigate("/drinks");

    } catch (error) {
        alert("Podczas usuwania wystąpił błąd");
        console.log(error)
    }
    

  }


  function getAlcohols(elem) {
    if (Object.keys(elem.ingredients.alcohols).length > 0) {
      const alcohols = elem.ingredients.alcohols;

      return (
        <div>
          <h4>Alkohole</h4>
          <ul>
            {alcohols.map(function (obj) {
              return (
                <li key={obj.id}>
                <Link as={Link} to={ '/alcohols/'+ obj.alcohol_id }>{obj.alcohol_name}</Link> - {obj.alcohol_amount}{obj.alcohol_unit}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }

  function getBeverages(elem) {
    if (Object.keys(elem.ingredients.beverages).length > 0) {
      const beverages = elem.ingredients.beverages;

      return (
        <div>
          <h4>Napoje</h4>
          <ul>
            {beverages.map(function (obj) {
              return (
                <li key={obj.id}>
                <Link as={Link} to={ '/beverages/'+ obj.beverage_id }>{obj.beverage_name}</Link> - {obj.beverage_amount}{obj.beverage_unit}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }

  function getAdditions(elem) {
    if (Object.keys(elem.ingredients.additions).length > 0) {
      const additions = elem.ingredients.additions;

      return (
        <div>
          <h4>Dodatki</h4>
          <ul>
            {additions.map(function (obj) {
              return (
                
                <li key={obj.id}>
                <Link as={Link} to={ '/additions/'+ obj.addition_id }>{obj.addition_name}</Link> - {obj.addition_amount} {obj.addition_unit}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }

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
          <Link className="btn btn-outline-dark" as={Link} to={"/drinks"}>
            Powrót do listy drinków
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
            src={elem[0].image_url}
            fluid={true}
            onError={(e) => {
              e.target.onError = null;
              e.target.src = "../320.png";
            }}
          />
        </Col>

        <Col xs="9">
          <h1>{elem[0].name}</h1>
          <p>{elem[0].description}</p>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center my-5">
        <Col xs="4">
          <h2>Składniki</h2>
          {getAlcohols(elem)}
          {getBeverages(elem)}
          {getAdditions(elem)}
        </Col>
        <Col xs="8">
          <h2>Przepis</h2>
          <p>{elem[0].recipe}</p>
        </Col>
      </Row>
    </Container>
  );
}

export default SingleDrink;
