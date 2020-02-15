import React, { Component, Redirect, redirectToReferrer } from "react";
import {
  Navbar,
  Form,
  Button,
  Nav,
  NavDropdown,
  FormControl
} from "react-bootstrap";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../App.css";

class Main extends Component {
  constructor(props) {
    super(props);

    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      search: "",
      results: []
    };
  }
  onChangeSearch(e) {
    this.setState({ search: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    const user = {
      search: this.state.search
    };

    console.log("submittiing");
    axios
      .post("http://localhost:8000/search", user)
      .then(res => {
        this.setState({
          results: res.data
        });
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({ search: "" });
  }
  render() {
    // ... rest of render method code
    const renderItems = this.state.results.map(function(item, i) {
      return <li key={i}>{item.username}</li>;
    });

    return (
      <Router>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">Memestagram</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            <Form inline onSubmit={this.onSubmit}>
              <FormControl
                type="search"
                placeholder="Search for a user"
                className="mr-sm-2"
                name="search"
                value={this.state.search}
                onChange={this.onChangeSearch}
              />
              <Button variant="outline-success" type="submit">
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <header className="App-header">
          <Switch>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/about">
              <About />
            </Route>
            <Route exact path="/searchresults">
              <ul className="App">{renderItems}</ul>
            </Route>
          </Switch>
        </header>
      </Router>
    );
  }
}
export default Main;
function SearchResults() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}
