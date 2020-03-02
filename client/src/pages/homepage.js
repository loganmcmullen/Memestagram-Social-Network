import React, { Component } from "react";
import Navbar from "../components/navbar";
import auth from "../authentication/auth-login";
import { Redirect } from "react-router-dom";

class HomePage extends Component {
  state = {};
  render() {
    if (!auth.isAuthenticated()) {
      return <Redirect to="/loginsignup" />;
    }
    return (
      <div>
        <Navbar />
        <p>Welcome to the home page skeleton</p>
      </div>
    );
  }
}

export default HomePage;
