//This code is from
//https://appdividend.com/2018/07/18/react-redux-node-mongodb-jwt-authentication/#React_Redux_Node_MongoDB_JWT_Authentication

import axios from "axios";

const setAuthToken = token => {
  if (token) {
    console.log("Adding axios token");
    axios.defaults.headers.common.Authorization = token;
  } else {
    console.log("Removing axios token");
    delete axios.defaults.headers.common.Authorization;
  }
};

export default setAuthToken;
