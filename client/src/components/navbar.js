import React, { Component } from "react";
import { Nav, Navbar, Button, Form, FormControl } from "react-bootstrap";
import auth from "../authentication/auth-login";

class NavBar extends Component {
  state = {};
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">Memestagram</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="#willeventuallybetheprofile">My Profile</Nav.Link>
          <Nav.Link href="/loginsignup" onClick={auth.removeAuthentication}>
            Sign Out
          </Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-info">Search</Button>
        </Form>
      </Navbar>
    );
  }
}
export default NavBar;
