import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          sign up
        </Route>
        <Route path="/signin">
          sign in 
        </Route>
        <Route path="/profile/:username">
          profile
        </Route>
        <Route path="/">
          Home
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
