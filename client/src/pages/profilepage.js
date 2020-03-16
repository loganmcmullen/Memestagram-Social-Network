import React, { Component } from "react";
import Navbar from "../components/navbar";
import auth from "../authentication/auth-login";
import { Redirect } from "react-router-dom";

class ProfilePage extends Component {
  state = {};
  render() {
    return (
      <div>
        <Navbar />
        <p>ProfilePage</p>
      </div>
    );
  }
}

export default ProfilePage;
