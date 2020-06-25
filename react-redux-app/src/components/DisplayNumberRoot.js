import React, {Component} from 'react';
import DisplayNumber from '../containers/DisplayNumber';

export default class DisplayNumberRoot extends Component{
    render(){
        return(
            <div>
                <h2>DisplayNumberRoot</h2>
                <DisplayNumber unit="kg"></DisplayNumber>
            </div>
        );
    }
}