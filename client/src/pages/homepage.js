import React, { Component } from "react";
import Navbar from "../components/navbar";
import ShowHomePictures from "../components/displayhomepage";
import auth from "../authentication/auth-login";
import { Redirect } from "react-router-dom";
import "../App.css";

class HomePage extends Component {
  render() {
    if (!auth.isAuthenticated()) {
      return <Redirect to="/loginsignup" />;
    }
    return (
      <div>
        <Navbar />
        <ShowHomePictures />
      </div>
    );
  }
}

export default HomePage;
