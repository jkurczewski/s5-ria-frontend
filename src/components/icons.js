import React from "react";
import { FaPercent, FaSmile } from 'react-icons/fa';
import './icons.css';

export default function Icons(props){

    function IconsService(props) {
        let iconsState = {'hasIcons': false, 'hasPercent': false, 'isSimple': false}
    
        if (Object.keys(props.ingredients.alcohols).length > 0) iconsState.hasPercent = true;
        if (Object.keys(props.ingredients).length < 8) iconsState.isSimple = true;
        if (iconsState.isSimple === true || iconsState.hasPercent === true) iconsState.hasIcons = true;

        return iconsState;
    }

    return(
        <div className={(IconsService(props).hasIcons) ? 'icons enable' : 'icons disable'}>
            <div className="icons-wrapper">
                <div className={(IconsService(props).hasPercent) ? 'icon enable' : 'icon disable'}>
                    <FaPercent />
                </div>
                <div className={(IconsService(props).isSimple) ? 'icon enable' : 'icon disable'}>
                    <FaSmile />
                </div>
            </div>
        </div>
    );
}