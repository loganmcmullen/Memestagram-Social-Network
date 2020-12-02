import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";

class SearchProfilePictures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: [],
    };
  }

  componentDidMount() {
    const user = {
      username: this.props.match.params.username,
    };
    axios
      .post("http://localhost:8000/api/photos/searchuser/files", user, {
        headers: { token: sessionStorage.getItem("jwt") },
      })
      .then((res) => {
        //Fill an array with the files sent back from the server. Each array element will use the filename and description
        //of the current element.
        var arr = [];
        for (var i = 0; i < res.data.length; i++) {
          arr.push({
            image: res.data[i].filename,
            description: res.data[i].description,
          });
        }
        //Fill this.state.img with the array from the for loop.
        this.setState({
          img: arr,
        });
      });
  }

  render() {
    return (
      <Container>
        <Row>
          {this.state.img.map((item) => {
            return (
              <Col>
                <Card
                  key={item}
                  style={{ width: "18rem" }}
                  bg="light"
                  border="dark"
                  className="card-img-wrap"
                >
                  <Card.Img
                    variant="top"
                    src={"http://localhost:8000/api/photos/image/" + item.image}
                    alt="Image could not be loaded"
                  />
                  <Card.Body>
                    <Card.Title>{item.description}</Card.Title>
                    <Card.Text>Comment section</Card.Text>
                    <InputGroup size="sm" className="mb-3">
                      <InputGroup.Prepend></InputGroup.Prepend>
                      <FormControl
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Leave a comment"
                      />
                    </InputGroup>
                    <Button variant="primary">Post comment</Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  }
}

export default withRouter(SearchProfilePictures);
