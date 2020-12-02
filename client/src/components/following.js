import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import {
  Form,
  Button,
  ListGroup,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { withRouter } from "react-router-dom";

class Following extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.visitProfile = this.visitProfile.bind(this);

    this.state = {
      search: "",
      following: [],
      showSuccess: false,
      showFailure: false,
    };
  }

  visitProfile(username) {
    const { history } = this.props;
    if (history) {
      history.push(`/search/${username}`);
    }
  }

  onChangeSearch(e) {
    this.setState({ search: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    //Submission must include JWT for authorization and username to determine user to follow
    //in the database.
    const search = {
      username: this.state.search,
    };

    //Sending axios post request
    axios
      .post("http://localhost:8000/api/follow/new", search, {
        headers: { token: sessionStorage.getItem("jwt") },
      })
      .then((res) => {
        if (res.status === 200) {
          //Re-render the following list to show the addition
          this.renderFollowers();
          //Display a success message, indicating to the user that the account was followed.
          this.setState({
            following: res.data.following,
            showSuccess: true,
            showFailure: false,
          });
        } else {
          //If not successful, show a failure message.
          this.setState({ showSuccess: false, showFailure: true });
        }
      })
      .catch((error) => {
        //If any error occurres, show a failure message to the user.
        this.setState({ showSuccess: false, showFailure: true });
        console.log(error);
      });
    this.setState({
      //Resetting the state.
      search: "",
    });
  }

  unfollowUser(username) {
    //Submission must include JWT for authorization and username to determine user to follow
    //in the database.
    const search = {
      username: username,
    };

    //Sending axios post request
    axios
      .patch("http://localhost:8000/api/follow/remove", search, {
        headers: { token: sessionStorage.getItem("jwt") },
      })
      .then((res) => {
        if (res.status === 200) {
          //Re-render the following list to show the submission
          this.renderFollowers();
          //Display a success message, indicating to the user that the account was unfollowed.
        }
      })
      .catch((error) => {
        //If any error occurres, show a failure message to the user.
        this.setState({ showSuccess: false, showFailure: true });
        console.log(error);
      });
  }

  //This function was made separate and apart of componentDidMount because it needs to be called
  //not only when the page is initially loaded, but also to re-render the followers after a user follows
  //someone new.
  renderFollowers() {
    axios
      .get("http://localhost:8000/api/follow/", {
        headers: { token: sessionStorage.getItem("jwt") },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("Success");
          this.setState({
            following: res.data.following,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //The moment this component mounts, renderFollowers is called to render the followers.
  componentDidMount() {
    this.renderFollowers();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Form onSubmit={this.onSubmit}>
            <Form.Group>
              <Form.Label style={{ color: "white" }}>
                Follow a new User
              </Form.Label>
              <Form.Control
                type="search"
                placeholder="Enter the username"
                name="search"
                value={this.state.search}
                onChange={this.onChangeSearch}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <br></br>
          <div
            id="success"
            style={{ display: this.state.showSuccess ? "block" : "none" }}
          >
            <Alert variant="success">User Followed.</Alert>
          </div>
          <div
            id="failure"
            style={{ display: this.state.showFailure ? "block" : "none" }}
          >
            <Alert variant="danger">User could not be followed.</Alert>
          </div>
          <p style={{ color: "white" }}>Already following:</p>
          <ListGroup as="ul">
            {this.state.following.map((item) => {
              return (
                <ListGroup.Item as="li" key={item}>
                  <Container>
                    <Row>
                      <Col
                        className="ProfileCol"
                        onClick={(e) => this.visitProfile(item, e)}
                      >
                        {item}
                      </Col>
                      <Col>
                        <Button
                          variant="danger"
                          type="button"
                          onClick={(e) => this.unfollowUser(item, e)}
                        >
                          Unfollow
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>
    );
  }
}

export default withRouter(Following);
