import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import { Form, Button, ListGroup, Alert } from "react-bootstrap";

class Following extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      search: "",
      following: [],
      showSuccess: false,
      showFailure: false
    };
  }

  onChangeSearch(e) {
    this.setState({ search: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const search = {
      token: sessionStorage.getItem("jwt"),
      username: this.state.search
    };

    axios
      .post("http://localhost:8000/api/follow/new", search, {
        headers: { token: sessionStorage.getItem("jwt") }
      })
      .then(res => {
        if (res.status === 200) {
          //Re-render the following list to show the addition
          this.renderFollowers();
          //Display a success message, indicating to the user that the account was followed.
          this.setState({
            following: res.data.following,
            showSuccess: true,
            showFailure: false
          });
        } else {
          this.setState({ showSuccess: false, showFailure: true });
        }
      })
      .catch(error => {
        this.setState({ showSuccess: false, showFailure: true });
        console.log(error);
      });
    this.setState({
      search: ""
    });
  }

  renderFollowers() {
    axios
      .get("http://localhost:8000/api/follow/", {
        headers: { token: sessionStorage.getItem("jwt") }
      })
      .then(res => {
        if (res.status === 200) {
          console.log("Success");
          this.setState({
            following: res.data.following
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.renderFollowers();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Form onSubmit={this.onSubmit}>
            <Form.Group>
              <Form.Label>Follow new User: </Form.Label>
              <Form.Control
                type="search"
                placeholder="Enter the username"
                name="search"
                value={this.state.search}
                onChange={this.onChangeSearch}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <br></br>
          <div
            id="success"
            style={{ display: this.state.showSuccess ? "block" : "none" }}
          >
            <Alert variant="success">User Followed.</Alert>
          </div>
          <div
            id="failure"
            style={{ display: this.state.showFailure ? "block" : "none" }}
          >
            <Alert variant="danger">User could not be followed.</Alert>
          </div>
          <p>Already following:</p>
          <ListGroup as="ul">
            {this.state.following.map(item => {
              return (
                <ListGroup.Item as="li" key={item}>
                  {item}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>
    );
  }
}

export default Following;
