import React, { Component } from "react";
import Navbar from "../components/navbar";
import ShowPictures from "../components/displayPictures";
import Photoupload from "../components/photoupload";
import ProfileDetails from "../components/profiledetails";
import "../App.css";

class ProfilePage extends Component {
  state = {};
  render() {
    return (
      <div>
        <Navbar />
        <ProfileDetails />
        <Photoupload />
        <ShowPictures />
      </div>
    );
  }
}

export default ProfilePage;
