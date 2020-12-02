import React, { Component } from "react";
import { Nav, Navbar, Button, Form, FormControl } from "react-bootstrap";
import auth from "../authentication/auth-login";
import { withRouter } from "react-router-dom";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.state = {
      search: ""
    };
  }

  onSubmit(e) {
    const { history } = this.props;
    console.log(history);
    if (history) {
      history.push(`/search/${this.state.search}`);
    }
    this.setState({
      search: ""
    });
  }
  onChangeSearch(e) {
    this.setState({ search: e.target.value });
  }
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">Memestagram</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/profile">My Profile</Nav.Link>
          <Nav.Link href="/following">Following</Nav.Link>
          <Nav.Link href="/loginsignup" onClick={auth.removeAuthentication}>
            Sign Out
          </Nav.Link>
        </Nav>
        <Form onSubmit={this.onSubmit} inline>
          <FormControl
            type="text"
            value={this.state.search}
            onChange={this.onChangeSearch}
            placeholder="Search"
            className="mr-sm-2"
          />
          <Button variant="outline-info" type="submit">
            Search
          </Button>
        </Form>
      </Navbar>
    );
  }
}
export default withRouter(NavBar);
