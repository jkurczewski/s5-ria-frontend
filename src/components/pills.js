import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function Pills(props) {
  function PilsService() {
    const iconsState = { hasPercent: false, isSimple: false };

    if (Object.keys(props.ingredients.alcohols).length > 0) iconsState.hasPercent = true;
    if (Object.keys(props.ingredients).length < 5) iconsState.isSimple = true;

    return iconsState;
  }

  return (
    <div className="row">
      <Col className={PilsService().hasPercent ? 'col-md-auto enable' : 'col-md-auto disable'}>
        <small>Drink z alkoholem</small>
      </Col>
      <Col className={PilsService().isSimple ? 'col-md-auto enable' : 'col-md-auto enable'}>
        <small>Mniej niż 5 składników!</small>
      </Col>
      <Col className={PilsService().hasPercent ? 'col-md-auto disable' : 'col-md-auto enable'}>
        <small>Drink bez alkoholu</small>
      </Col>
    </div>
  );
}
