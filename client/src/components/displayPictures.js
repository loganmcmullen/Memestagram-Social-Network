import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
  FormFile,
  Form,
  Modal
} from "react-bootstrap";
import "../App.css"

class RenderPictures extends Component {
  constructor(props) {
    super(props);
    this.onDeleteButton = this.onDeleteButton.bind(this);

    this.state = {
      img: [],
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
      show: false
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8000/files/", {
        headers: { token: sessionStorage.getItem("jwt") }
      })
      .then(res => {
        //Fill an array with the files sent back from the server. Each array element will use the filename and description
        //of the current element.
        var arr = [];
        for (var i = 0; i < res.data.length; i++) {
          arr.push({
            image: res.data[i].filename,
            description: res.data[i].description,
            photoid: res.data[i]._id,
            likes: res.data[i].likes,
            dislikes: res.data[i].dislikes
          });
        }
        //Fill this.state.img with the array from the for loop.
        this.setState({
          img: arr
        });
      });
  }

  onDeleteButton(photoid, index) {

    this.setState({...this.state.jasper, name: 'someothername'});

    axios
      .delete("http://localhost:8000/files/" + photoid, {
        headers: {token: sessionStorage.getItem("jwt")}
      })
      .then(res => {
      })
      .catch(error => {
        console.log(error);
      });     
      setTimeout(()=>{alert("Image Deleted"); window.location.reload(true);}, 2000);
      //window.location.reload(true);

    }


  handleShow(e) {
    this.setState({
      show: true
    });
  }

  handleClose(e) {
    this.setState({
      show: false
    });
  }

  onChangeDescription(desc, number) {
    console.log(desc);
    console.log(this.img[number].description);
  }
  
  clickLike = ()  => {
    if(!this.state.liked){
      this.setState({
        likes: this.state.likes + 1,
        liked: true
      })
    } else{
      this.setState({
        likes: this.state.likes - 1,
        liked: false
      })
    }
    const feedback = {likes:this.state.likes}
    axios.post("http://localhost:8000/files/likes", feedback).then(res => {console.log(res.data.likes)})
  }

  clickDislike = ()  => {
    if(!this.state.disliked){
      this.setState({
        dislikes: this.state.dislikes + 1,
        disliked: true
      })
    } else{
      this.setState({
        dislikes: this.state.dislikes - 1,
        disliked: false
      })
    }
    const feedback = {likes:this.state.dislikes}
    axios.post("http://localhost:8000/files/dislikes", feedback).then(res => {console.log(res.data.dislikes)})
  }

  render() {
    return (
      <Container>
        <Row>
          {this.state.img.map((item, index) => {
            return (
              <Col>
                <Card
                  key={item}
                  style={{ width: "18rem" }}
                  bg="light"
                  border="dark"
                >
                  <Card.Img
                    variant="top"
                    src={"http://localhost:8000/image/" + item.image}
                    alt="Image could not be loaded"
                  />
                  <Card.Body>
                    <Card.Title>{item.description}</Card.Title>
                    <br></br>
                    <Card.Text>This will be the comment section</Card.Text>
                    <Button onClick = {this.clickLike}>Like</Button>
                    <Card.Text>Like count: {this.state.likes}</Card.Text>
                    <Button onClick = {this.clickDislike}>Dislike</Button>
                    <Card.Text>Dislike count: {this.state.dislikes}</Card.Text>
                    <InputGroup size="sm" className="mb-3">
                      <FormControl
                        aria-label="Small"
                        aria-describedby="inputGroup-sizing-sm"
                        placeholder="Leave a comment"
                      />
                    </InputGroup>
                    <Button variant="primary float-left">Post comment</Button>
                    <Button onClick={()=> this.handleShow()} className = "btn btn-secondary float-right btn-sm float-right">Update Desciption</Button>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Update Description</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Form.Group controlId="description">
                            <Form.Control
                              type="description"
                              placeholder="Enter description"
                              name="description"
                              value={this.state.description}
                            />
                          </Form.Group>
                          <Button onClick={()=> {this.onChangeDescription(this.state.description, index)}} variant="dark" type="submit">
                            Update
                          </Button>
                        </Form>
                      </Modal.Body>
                    </Modal>
                    <Form>
                      <Button onClick = {() => {this.onDeleteButton(item.photoid, index)}} className = "btn btn-danger btn-sm float-left">Delete</Button>
                    </Form>
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

export default RenderPictures;
