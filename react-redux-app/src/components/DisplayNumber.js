import React, {Component} from 'react';

export default class DisplayNumber extends Component{
    
    render(){
        return(
            <div>
                <h3>DisplayNumber</h3>
                <input type="text" value={this.props.number} readOnly></input>
                {this.props.unit}
            </div>
        );
    }
}