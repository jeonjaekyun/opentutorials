import React,{Component} from 'react';
import AddNumber from '../containers/AddNumber';

export default class AddNumberRoot extends Component{
    render(){
      return(
        <div>
          <h2>AddNumberRoot</h2>
          <AddNumber></AddNumber>
        </div>
      );
    }
  }
  