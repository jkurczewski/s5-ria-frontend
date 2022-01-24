import React from 'react'
import { Form, Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';

const api = axios.create({
    baseURL: `http://localhost:8000/api/ingredients`,
  });


export default function SearchBar(props) {

    console.log(props)

    return (
        <>
            
        </>
    );
}
