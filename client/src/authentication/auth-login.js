import setAuthToken from "./setAuthenticationToken";
import jwtDecode from "jwt-decode";
import axios from "axios";

//Constant that contains three functions for authentication.
const authenticate = {
  authenticate(jsonwebtoken, callback) {
    //Setting the token in sessionStorage
    sessionStorage.setItem("jwt", jsonwebtoken);
    //Attaching token to all axios requests.
    setAuthToken(jsonwebtoken);
    callback();
  },
  isAuthenticated() {
    //Check if user has a JWT in sessionStorage
    if (sessionStorage.getItem("jwt")) {
      return true;
    }
    return false;
  },
  removeAuthentication(callback) {
    //Remove the JWT from sessionStorage (essentially logging a user out).
    sessionStorage.removeItem("jwt");
    //Remove token from axios requests
    setAuthToken();
    callback();
  },
  setCurrentUser() {
    const token = {
      token: sessionStorage.getItem("jwt")
    };
    axios.post("http://localhost:8000/api/currentUser", token).then(res => {
      return res.data;
    });
  }
};
export default authenticate;
