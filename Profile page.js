import React, { Component } from 'react';
import {
    Form,
    Button,
    Badge
} from 'react-bootstrap';
import '../App.css';
import profilepic from "./maxresdefault.jpg"

//POST function that uses fetch to send our data.
async function postData(url = '', data = {}) {
}

class RenderSignUpForm extends Component {

    constructor() {
        super();
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);

        this.setState({
            res: data
        })
        postData('http://localhost:8000/api/user', { email: data.get('email'), username: data.get('username'), password: data.get('password') })
            .then((data) => {
                console.log(data);
            })
    }

    render() {
        return (
            <div className="App">
                <h1> MEMESTAGRAM</h1>
                <div class="App-header">
                    <img class = "rcorners1" src={require('./maxresdefault.jpg')} alt = "Matthew McConaughey" height="200" width="240"/>
                    <h1> Matthew McConaughey</h1>
                    <Button variant="primary">Upload Picture</Button>
                    <Button variant="primary">View Pictures</Button>
                </div>
             </div>
        );
    }
}

export default RenderSignUpForm;