import React, { Component } from "react";
import Navbar from "../components/navbar";
import auth from "../authentication/auth-login";
import { Redirect } from "react-router-dom";
import Photoupload from "../components/photoupload";
import AccountDetails from "../components/profiledetails";
import "../App.css";

class ProfilePage extends Component {
  state = {};
  render() {
    return (
      <div>
        <Navbar />
        <p>ProfilePage</p>
        <AccountDetails />
        <Photoupload />
      </div>
    );
  }
}

export default ProfilePage;
