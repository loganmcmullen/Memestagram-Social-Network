import React, { Component } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import auth from "../authentication/auth-login";
import "../styling/signupstyle.css";

class RenderSignUpForm extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      username: "",
      password: "",
      redirect: false
    };
  }
  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  onChangeUsername(e) {
    this.setState({ username: e.target.value });
  }
  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password
    };
    console.log("Submitting User Details.");
    axios
      .post("http://localhost:8000/api/register", user)
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

    this.setState({ email: "", username: "", password: "" });
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="/" />;
    }
    return (
      <div className="Signup">
        <div className="Signup-header">
          <Card
            border="dark"
            className="rounded mb-20"
            bg="light"
            style={{ width: "25rem", padding: "40px" }}
            text="dark"
          >
            <h1>Create an account</h1>
            <Card.Body>
              <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="email">
                  <Card.Text>
                    <Form.Label>Enter your Email</Form.Label>
                  </Card.Text>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                  />
                </Form.Group>
                <Form.Group controlId="username">
                  <Card.Text>
                    <Form.Label>Create a Username</Form.Label>
                  </Card.Text>
                  <Form.Control
                    type="username"
                    placeholder="Enter username"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Card.Text>
                    <Form.Label>Enter a Password</Form.Label>
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
                  Create
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default RenderSignUpForm;
