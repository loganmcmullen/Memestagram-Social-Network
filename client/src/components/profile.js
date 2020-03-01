import React, { Component } from 'react';
import {
    Form,
    Button,
    Badge
} from 'react-bootstrap';
import axios from "axios";
import "../App.css";
import profilepic from "./maxresdefault.jpg"

class RenderProfilePage extends Component{
    
    /*
    constructor(props){
        super(props);
        //this will be changed later on
    
        this.state = {
            userName = "",
            realName = "",
            bio = ""
        };
        
    }
        onUpload(e){
        e.preventDefault();

        const user = {
            userName: this.state.userName,
            realName: this.state.realName
            bio: this.state.bio
        };
        axios
            .post("http://localhost:8000/api/login", user)
            .then(res => {
            console.log(res.data);
            })
            .catch(error => {
            console.log(error);
            });

        this.setState({ userName: "", realName: "" , bio = ""});
    }
*/

    render() {
        return (
            <div className="App">
                <div class="App-header">
                <h1> MEMESTAGRAM</h1>
                    <img class = "rcorners1" src={require('./maxresdefault.jpg')} alt = "Matthew McConaughey" height="200" width="240"/>
                    <h1> Matthew McConaughey</h1>
                    <Button variant="primary">Upload Picture</Button> 
                    <Button variant="primary">View Pictures</Button>
                </div>
            </div>
        );
    }
}


export default RenderProfilePage;