import React, { Component } from "react";
import Navbar from "../components/navbar";
import Photoupload from "../components/photoupload";
import AccountDetails from "../components/profiledetails";
import "../App.css";

class ProfilePage extends Component {
  state = {};
  render() {
    return (
      <div>
        <Navbar />
        <AccountDetails />
        <Photoupload />
      </div>
    );
  }
}

export default ProfilePage;
