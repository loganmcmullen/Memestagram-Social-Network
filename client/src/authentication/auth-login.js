import setAuthToken from "./setAuthenticationToken";

//Constant that contains three functions for authentication.
const authenticate = {
  authenticate(jsonwebtoken, callback) {
    //Setting the token in sessionStorage
    sessionStorage.setItem("jwt", JSON.stringify(jsonwebtoken));
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
  setCurrentUser() {}
};
export default authenticate;
