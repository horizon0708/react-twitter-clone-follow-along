import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { SignUpPage } from "./pages/signUpPage";
import SignInPage from "./pages/signInPage";
import { supabaseClient } from "./api/supabaseClient";
import { SignOutPage } from "./pages/signOutPage";
import { NavBar } from "./component/navBar";
import { Container } from "@material-ui/core";

function App() {
  return (
    <Router>
      <NavBar />
      <Container maxWidth="sm">
      <Switch>
      <Route path="/signup">
          <SignUpPage />
        </Route>
        <Route path="/signin">
          <SignInPage />
        </Route>
        <Route path="/signout">
          <SignOutPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      </Container>
    </Router>
  );
}

const HomePage = () => {
  const session = supabaseClient.auth.session()
  return <div>
    {session && `you are logged in as ${session.user.email}`}
  </div>
}

export default App;
