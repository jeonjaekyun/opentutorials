import React, { Component } from 'react';

class TOC extends Component {
  //newProps의 값이 변하면 render()함수 실행
  //만약 기존의 data의 값을 더하는 push를 하면 기존의 값과 새로 들어오는 값이 같아져 구분이 되지 않으므로
  //concat을 통해 새로운 값을 만들어 주는 것이 좋다.
  shouldComponentUpdate(newProps, newState) {
    console.log('TOC.shouldComponentUpdate()');
    if(newProps.data === this.props.data){
      return false;
    }
    return true;
  }

  render() {
    console.log("TOC.render()");
    var lists = [];
    var data = this.props.data;
    for (var i = 0; i < data.length; i++) {
      lists.push(<li key={data[i].id}><a href={'/contents/' + data[i].id}
        data-id={data[i].id}
        onClick={function (id, e) {
          e.preventDefault();
          this.props.onChangePage(id);
        }.bind(this, data[i].id)}
      >{data[i].title}</a></li>)
    }
    return (
      <nav>
        <ul>
          {lists}
        </ul>
      </nav>
    );
  }
}

export default TOC;