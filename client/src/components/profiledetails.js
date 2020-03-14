import React, { Component } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";

class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: ""
    };
  }

  //Once the component is mounted, a call is immediately made to fetch a user's details.
  //TODO: Add in more details and the ability to change these details.
  componentDidMount() {
    axios
      .get("http://localhost:8000/api/currentUser", {
        headers: { token: sessionStorage.getItem("jwt") }
      })
      .then(res => {
        this.setState({
          username: res.data.username,
          email: res.data.email
        });
      });
  }
  render() {
    return (
      <Card
        className="rounded mb-20"
        bg="light"
        style={{ width: "20rem", padding: "40px" }}
      >
        <h1>User Details</h1>
        <p>Email: {this.state.email}</p>
        <p>Username: {this.state.username}</p>
      </Card>
    );
  }
}

export default AccountDetails;
