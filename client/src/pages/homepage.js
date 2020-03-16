import React, { Component } from "react";
import Navbar from "../components/navbar";
import auth from "../authentication/auth-login";
import { Redirect } from "react-router-dom";
import { Container, Row, Col} from 'react-bootstrap';
import axios from "axios";

class HomePage extends Component {
  state = {
    title: '',
    body: '',
    posts: []
  };

  userState = {
    username: '',
    userPosts: []
  }

  componentDidMount = () => {
    this.getBlogPost();
    this.getUserInformation();
  };


  getBlogPost = () => {
    axios.get('http://localhost:8000/api')
    .then((response) => {
      const data = response.data;
      this.setState ({ posts: data });
      console.log('Data has been received!');
    })
    .catch(() => {
      alert('Error retrieving data')
    })
  }

  getUserInformation = () => {
    axios.get('http://localhost:8000/api/users')
    .then((response) => {
      const user = response.user;
      this.setState ({ userPosts: user });
      console.log('Data has been received!');
    })
    .catch(() => {
      alert('Error retrieving user data');
    })
  }

  // displayUserData = (userPosts) => {
    // if (userPosts.length == 0) {
    //   return null;
    // }
    
  //   return userPosts.map((post, index) => (
  //     <div key = {index}> 
  //       <h3>
  //       {post.username} 
  //       </h3>
  //       <p>
  //         {post.body}
  //       </p>
  //     </div>
  //   ))
  // };

  displayBlogPost = (posts) => {
    if (posts.length == 0) {
      return null;
    }
    
    return posts.map((post, index) => (
      <div key = {index}> 
        <h3>
        {post.title} 
        </h3>
        <p>
          {post.body}
        </p>
      </div>
    ))
  };


  render() {
    if (!auth.isAuthenticated()) {
      return <Redirect to="/loginsignup" />;
    }

    return (
      <div>
        <Navbar />
        <Container fluid>
        <Row>
          <Col>
          Home Page Test
          </Col>
        </Row>
      </Container>

      {/* <div className="blogPost">
      {this.displayUserData(this.state.userPosts)}
      </div> */}
      </div>
    )
  };
}

export default HomePage;
