import React, { Component } from 'react';
import './App.css';
import TOC from './components/TOC';
import Subject from './components/Subject';
import Content from './components/Content';

//props는 부모컨포넌트로 부터 받아온 값을 사용 할 때 쓰고
//state는 컨포넌트 자신의 값을 설정/사용 할 때 쓴다.
//유사 javascript 코드 jsx
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'read',
      selected_id:2,
      subject: { title: 'Web', sub: "World Wide Web!!" },
      welcome: { title: 'welcome!!', desc: 'Hello, React!!' },
      contents: [
        { id: 1, title: 'HTML', desc: 'HTML is HyperText Markup Language' },
        { id: 2, title: 'CSS', desc: 'CSS is ...' },
        { id: 3, title: 'Javascript', desc: 'Javascript is ...' },
      ]
    }
  }
  render() {
    var _title, _desc = null;
    if (this.state.mode === 'welcome') {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
    }else if(this.state.mode === 'read'){
      var data = this.state.contents;
      for(var i=0;i<data.length;i++){
        if(data[i].id === this.state.selected_id){
          _title = this.state.contents[i].title;
          _desc = this.state.contents[i].desc;
        }
      }
    }

    return (
      <div className="App">
        <Subject title={this.state.subject.title} 
        sub={this.state.subject.sub}
        //onChangePage를 자식 컨포넌트에서 사용할 수 있게 해준다(this.props.onChangePage()를 통해)
        onChangePage={function(){
          this.setState({mode:'welcome'});
        }.bind(this)}
        ></Subject>
        {/* <header>
          <h1><a href="/" onClick={
            function(e){
              e.preventDefault();
              this.setState({mode:'welcome'});
            }.bind(this)
          }>{this.state.subject.title}</a></h1>
          {this.state.subject.sub}
        </header> */}
        <TOC data={this.state.contents} onChangePage={function(id){
          this.setState({mode:'read',selected_id:id})
        }.bind(this)}></TOC>
        <Content title={_title} desc={_desc}></Content>
      </div>
    );
  }
}

export default App;