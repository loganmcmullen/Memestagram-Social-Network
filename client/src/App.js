import React from "react";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  withRouter
} from "react-router-dom";
import { createBrowserHistory } from "history";
import LoginSignupPage from "./pages/loginsignup";
import HomePage from "./pages/homepage";
import FollowingPage from "./pages/managefollowing";
import ProfilePage from "./pages/profilepage";
import SearchProfilePage from "./pages/searchprofilepage";
import "./App.css";

function App() {
  const history = createBrowserHistory();
  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route exact path="/" render={props => <HomePage />}></Route>
          <Route
            exact
            path="/loginsignup"
            render={props => <LoginSignupPage />}
          ></Route>
          <Route
            exact
            path="/following"
            render={props => <FollowingPage />}
          ></Route>
          <Route
            exact
            path="/profile"
            render={props => <ProfilePage />}
          ></Route>
          <Route
            exact
            path="/search/:username"
            render={props => <SearchProfilePage />}
          ></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
