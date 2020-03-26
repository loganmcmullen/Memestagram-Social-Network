import React, { Component } from "react";
import Navbar from "../components/navbar";
import Following from "../components/following";
import auth from "../authentication/auth-login";
import { Redirect } from "react-router-dom";

class FollowingPage extends Component {
  state = {};
  render() {
    //auth.isAuthenticated uses the functions defined on the auth-login page to
    //determine whether a user is currently logged in.
    if (!auth.isAuthenticated()) {
      return <Redirect to="/loginsignup" />;
    }
    return (
      <div>
        <Navbar />
        <Following />
      </div>
    );
  }
}

export default FollowingPage;
