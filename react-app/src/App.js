import React, { Component } from 'react';
import './App.css';
import TOC from './components/TOC';
import Subject from './components/Subject';
import ReadContent from './components/ReadContent';
import CreateContent from './components/CreateContent';
import UpdateContent from './components/UpdateContent';
import Control from './components/Control';

//props는 부모컨포넌트로 부터 받아온 값을 사용 할 때 쓰고
//state는 컨포넌트 자신의 값을 설정/사용 할 때 쓴다.
//유사 javascript 코드 jsx
class App extends Component {
  constructor(props) {
    super(props);
    this.max_id = 3;
    this.state = {
      mode: 'create',
      selected_id: 2,
      subject: { title: 'Web', sub: "World Wide Web!!" },
      welcome: { title: 'welcome!!', desc: 'Hello, React!!' },
      contents: [
        { id: 1, title: 'HTML', desc: 'HTML is HyperText Markup Language' },
        { id: 2, title: 'CSS', desc: 'CSS is ...' },
        { id: 3, title: 'Javascript', desc: 'Javascript is ...' },
      ]
    }
  }
  getReadContent() {
    var data = this.state.contents;
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === this.state.selected_id) {
        return data[i];
      }
    }
  }
  getContent() {
    var _title, _desc, _article = null;
    if (this.state.mode === 'welcome') {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
      _article = <ReadContent title={_title} desc={_desc}></ReadContent>;
    } else if (this.state.mode === 'read') {
      var _content = this.getReadContent();
      _article = <ReadContent title={_content.title} desc={_content.desc}></ReadContent>;
    } else if (this.state.mode === 'create') {
      //console.log(this);
      //debugger;
      _article = <CreateContent onSubmit={
        function (_title, _desc) {
          var _contents = this.state.contents.concat({
            id: ++this.max_id, title: _title, desc: _desc
          });
          this.setState({
            contents: _contents,
            mode: 'read',
            selected_id: this.max_id
          });
        }.bind(this)
      }></CreateContent>;
    } else if (this.state.mode === 'update') {
      _content = this.getReadContent();
      _article = <UpdateContent id={_content.id} title={_content.title} desc={_content.desc}
        onSubmit={
          function (_id, _title, _desc) {
            var _contents = Array.from(this.state.contents);
            for (var i = 0; i < _contents.length; i++) {
              if (_contents[i].id === Number(_id)) {
                _contents[i] = { id: Number(_id), title: _title, desc: _desc };
                break;
              }
            }
            this.setState({
              contents: _contents,
              mode: 'read',
              selected_id: Number(_id)
            })
          }.bind(this)
        }
      ></UpdateContent>;
    }

    return _article;
  }
  render() {
    return (
      <div className="App">
        <Subject title={this.state.subject.title}
          sub={this.state.subject.sub}
          //onChangePage를 자식 컨포넌트에서 사용할 수 있게 해준다(this.props.onChangePage()를 통해)
          onChangePage={function () {
            this.setState({ mode: 'welcome' });
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
        <TOC data={this.state.contents} onChangePage={function (id) {
          this.setState({ mode: 'read', selected_id: id })
        }.bind(this)}></TOC>
        <Control onChangeMode={
          function (_mode) {
            if (_mode === 'delete') {
              if (window.confirm('really?')) {
                var _contents = Array.from(this.state.contents);
                for (var i = 0; i < _contents.length; i++) {
                  if (_contents[i].id === this.state.selected_id) {
                    _contents.splice(i, 1);
                    break;
                  }
                }
                this.setState({
                  mode: 'welcome',
                  contents: _contents
                });
                alert('deleted');
              }
            } else {
              this.setState({ mode: _mode })
            }
          }.bind(this)
        }></Control>
        {this.getContent()}
      </div>
    );
  }
}

export default App;