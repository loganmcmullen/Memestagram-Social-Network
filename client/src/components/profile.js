import React, { Component } from "react";
import * as ReactBootstrap from "react-bootstrap";
import axios from "axios";
import "../App.css";
import RenderProfilePictures from './displayPictures';

class RenderProfilePage extends Component {
  //referenced from https://medium.com/@mahesh_joshi/reactjs-nodejs-upload-image-how-to-upload-image-using-reactjs-and-nodejs-multer-918dc66d304c
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      img: null
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post("http://localhost:8000/uploads", formData, config)
      .then(response => {
        alert("The file is successfully uploaded");
      })
      .catch(error => {});
  }

  //Request image from server when component renders.

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }


  render() {
    return (
            <div className="App">
                <h4> MEMESTAGRAM</h4>
                <div className="App-header">
                <br></br>
                <h4> Matthew McConaughey</h4> 
                <img className = "rcorners1" src={require('./maxresdefault.jpg')} alt = "Matthew McConaughey"/>
                    <div className = "custom-file mb-3">
                        <span className="label label-warning">Upload a picture</span>
                        <form onSubmit={this.onFormSubmit}>
                            <input className="btn btn-primary disabled" type="file" name="myImage" onChange= {this.onChange}/>
                            <button className="btn btn-primary active" type = "submit">Upload</button>
                        </form>                           
                    </div>
                    <div className="col-md-6 m-auto">
                        <RenderProfilePictures/>
                    </div>
                </div>
            </div>
    );
  }
}



export default RenderProfilePage;


