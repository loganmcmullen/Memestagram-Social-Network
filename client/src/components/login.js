import React, { Component } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import auth from "../authentication/auth-login";
import "../styling/loginstyle.css";

class RenderLoginForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    //By default the state contains an empty username and empty password.
    this.state = {
      email: "",
      password: "",
      redirect: false
    };
  }
  //When this function is called, change the username to the new value.
  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  //When this function is called, change the username to the new value.
  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };
    axios
      .post("http://localhost:8000/api/login", user)
      .then(res => {
        if (res.status === 200) {
          auth.authenticate(res.data.token, () => {
            this.setState({ redirect: true });
          });
        }
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({ email: "", password: "" });
  }
  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div className="Login">
        <div className="Login-header">
          <Card
            border="dark"
            className="rounded mb-20"
            bg="light"
            style={{ width: "18rem", padding: "40px" }}
            text="dark"
          >
            <h1>Log in to your account</h1>
            <Card.Body>
              <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="Email">
                  <Card.Text>
                    <Form.Label>Email</Form.Label>
                  </Card.Text>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Card.Text>
                    <Form.Label>Password</Form.Label>
                  </Card.Text>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default RenderLoginForm;
