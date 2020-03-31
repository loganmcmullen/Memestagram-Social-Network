import React, { Component } from "react";
import Navbar from "../components/navbar";
import ShowSearchPictures from "../components/searchdisplaypictures";
import SearchProfileDetails from "../components/searchprofiledetails";
import "../App.css";
class SearchProfilePage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Navbar />
        <SearchProfileDetails />
        <ShowSearchPictures />
      </div>
    );
  }
}

export default SearchProfilePage;
