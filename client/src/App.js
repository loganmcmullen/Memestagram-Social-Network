import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import LoginSignupPage from "./pages/loginsignup";
import HomePage from "./pages/homepage";
import FollowingPage from "./pages/managefollowing";
import ProfilePage from "./pages/profilepage";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/loginsignup">
            <LoginSignupPage />
          </Route>
          <Route exact path="/following">
            <FollowingPage />
          </Route>
          <Route exact path="/profile">
            <ProfilePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
