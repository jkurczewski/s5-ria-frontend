import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './home';
import ListAdds from './list_adds';
import ListAlcos from './list_alcos';
import ListBevs from './list_bevs';
import ListDrinks from './list_drinks';
import SingleAdd from './single_add';
import SingleAlco from './single_alco';
import SingleBev from './single_bev';
import SingleDrink from './single_drink';
import AddElement from './add-element'

function Pages(){
    return(
        <Routes>
            <Route exact path="/" element= { <Home /> } />

            <Route path = "/additions" element = { <ListAdds /> } />
            <Route path = "/alcohols" element = { <ListAlcos /> } />
            <Route path = "/beverages" element = { <ListBevs /> } />
            <Route path = "/drinks" element = { <ListDrinks /> } />

            <Route path = "/additions/:id" element = { <SingleAdd /> } />
            <Route path = "/alcohols/:id" element = { <SingleAlco /> } />
            <Route path = "/drinks/:id" element = { <SingleDrink /> } />
            <Route path = "/beverages/:id" element = { <SingleBev /> } />

            <Route path = "/add" element = { <AddElement /> } />
        </Routes>       
    );
};

export default Pages;
