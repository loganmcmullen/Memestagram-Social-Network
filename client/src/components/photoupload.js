import React, { Component } from "react";
import axios from "axios";
import "../App.css";

class RenderProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
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

  render() {
    return (
      <div>
        <div className="App">
          <div className="col-md-6 m-auto">
            <h4>Upload a new picture to your account</h4>
            <br></br>
            <form onSubmit={this.onFormSubmit}>
              <input
                type="file"
                name="myImage"
                accept="image/png, image/jpeg"
                onChange={this.onChange}
              />
              <button type="submit">Upload</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RenderProfilePage;
