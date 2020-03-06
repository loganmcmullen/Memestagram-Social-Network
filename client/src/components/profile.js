import React, { Component } from "react";
import axios from "axios";
import "../App.css";
import Navbar from "../components/navbar";

class RenderProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      username: "",
      email: ""
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
  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }
  componentDidMount() {
    axios
      .post(
        "http://localhost:8000/api/currentUser",
        {},
        {
          headers: { token: sessionStorage.getItem("jwt") }
        }
      )
      .then(res => {
        console.log(res.data.username);
        this.setState({
          username: res.data.username,
          email: res.data.email
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="App">
          <div className="App-header">
            <div className="Original-background">
              Your username: {this.state.username}
              <br></br>
              Your email: {this.state.email}
            </div>

            <div className="col-md-6 m-auto">
              <h4>Upload a new picture to your account</h4>
              <br></br>
              <form onSubmit={this.onFormSubmit}>
                <input type="file" name="myImage" onChange={this.onChange} />
                <button type="submit">Upload</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RenderProfilePage;
