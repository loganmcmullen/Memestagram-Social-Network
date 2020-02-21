import React, { Component } from "react";
import { Button, Badge } from "react-bootstrap";
import "../App.css";
import LoginForm from "../components/login";
import SignUpForm from "../components/signup";
import windowsman from "../windowsbackground.jpg";

class AuthenticationForm extends Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.state = {
      isLogin: true,
      isRegister: false
    };
  }
  handleLoginClick() {
    this.setState({
      isLogin: true,
      isRegister: false
    });
  }
  handleRegisterClick() {
    this.setState({
      isLogin: false,
      isRegister: true
    });
  }
  render() {
    const isLogin = this.state.isLogin;
    const isRegister = this.state.isRegister;
    let form;

    if (isLogin) {
      form = (
        <div className="Windows-background">
          <RegisterButton onClick={this.handleRegisterClick} />
          <LoginForm />
        </div>
      );
    }
    if (isRegister) {
      form = (
        <div className="Windows-background">
          <LoginButton onClick={this.handleLoginClick} />
          <SignUpForm />
        </div>
      );
    }
    return <div>{form}</div>;
  }
}

function LoginButton(props) {
  return (
    <Button variant="secondary" size="lg" onClick={props.onClick} block>
      <Badge variant="success">
        Already have an account? Click here to Login
      </Badge>
    </Button>
  );
}
function RegisterButton(props) {
  return (
    <Button variant="secondary" size="lg" onClick={props.onClick} block>
      <Badge variant="danger">
        Don't have an account? Click here to Sign up
      </Badge>
    </Button>
  );
}
export default AuthenticationForm;
