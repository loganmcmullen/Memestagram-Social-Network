import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Jumbotron, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

class SearchProfileDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      following: "",
      followers: "",
      bio: "",
      nouserfound: false
    };
  }

  //Once the component is mounted, a call is immediately made to fetch a user's details.
  componentDidMount() {
    const user = {
      username: this.props.match.params.username
    };
    axios
      .post("http://localhost:8000/api/searchuser", user, {
        headers: { token: sessionStorage.getItem("jwt") }
      })
      .then(res => {
        console.log(res);
        try {
          this.setState({
            username: res.data.username,
            email: res.data.email,
            following: res.data.following.length,
            followers: res.data.followers.length,
            bio: res.data.bio
          });
        } catch (error) {
          console.log(error);
          this.setState({
            nouserfound: true
          });
        }
      });
  }

  render() {
    if (this.state.nouserfound) {
      return (
        <Jumbotron fluid>
          <h2>
            A user called {this.props.match.params.username} was not found
          </h2>
        </Jumbotron>
      );
    }
    return (
      <Jumbotron fluid>
        <Container>
          <h2>{this.state.username}</h2>
          <Row>
            <Col>
              <h4>Biography</h4>
              {this.state.bio}
            </Col>
            <Col>
              <h4>Dankness Rating</h4>
            </Col>
            <Col>
              <h4>Following</h4>
              {this.state.following}
            </Col>
            <Col>
              <h4>Followers</h4>
              {this.state.followers}
            </Col>
          </Row>
          <Row></Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default withRouter(SearchProfileDetails);
