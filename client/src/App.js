import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import LoginSignupPage from "./pages/loginsignup";
import HomePage from "./pages/homepage";
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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
