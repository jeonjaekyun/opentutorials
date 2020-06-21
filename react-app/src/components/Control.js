import React, { Component } from 'react';

class Control extends Component {
    render() {
        return (
            <ul>
                <li><a href="/create" onClick={
                    function (e) {
                        e.preventDefault();
                        this.props.onChangeMode('create');
                    }.bind(this)
                }>create</a></li>
                <li><a href="/update" onClick={
                    function (e) {
                        e.preventDefault();
                        this.props.onChangeMode('update');
                    }.bind(this)
                }>update</a></li>
                {/* 브라우저에서 편의상 a 태그의 url을 미리 방문하여 다운로드 받는 경우가 있다.
                delete를 a 태그로 해두면 미리 방문하여 delete되는 경우가 있을 수 있기 때문에
                delete는 input 태그로 하는것이 안전하다. */}
                <li><input type="button" value="delete" onClick={
                    function (e) {
                        e.preventDefault();
                        this.props.onChangeMode('delete');
                    }.bind(this)
                } /></li>
            </ul>
        );
    }
}

export default Control;