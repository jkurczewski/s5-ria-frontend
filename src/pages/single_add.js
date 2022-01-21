import React from 'react';
import { useParams } from 'react-router-dom';


function SingleAdd() {

    const params = useParams();

    console.log(params.id)

    return(
        <h1>SingleAdd</h1>
    );
};

export default SingleAdd;