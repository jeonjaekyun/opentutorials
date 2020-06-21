import React, { Component } from 'react';

class UpdateContent extends Component {
    render() {
        console.log("UpdateContent.render()");
        return (
            <article>
                <h2>Update</h2>
                <form action="/update_process" method="post"
                    onSubmit={
                        function (e) {
                            e.preventDefault();
                            this.props.onSubmit(e.target.id.value, e.target.title.value, e.target.desc.value);
                        }.bind(this)
                    }
                >
                    <p><input type="hidden" name="id" value={this.props.id}></input></p>
                    <p><input type="text" name="title" defaultValue={this.props.title}/></p>
                    <p><textarea name="desc"rows="10" cols="30" defaultValue={this.props.desc}/></p>
                    <p><input type="submit" value="update" /></p>
                </form>
            </article>
        );
    }
}

export default UpdateContent;
