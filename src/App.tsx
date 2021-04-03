import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { SignUpPage } from "./pages/signUp";
import { SignInPage } from "./pages/signIn";
import { UploadButton } from "./components/uploadButton";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <SignUpPage />
        </Route>
        <Route path="/signin">
          <SignInPage />
        </Route>
        <Route path="/profile/:username">
          profile
        </Route>
        <Route path="/">
          Home
          <UploadButton onUpload={()=>{}} isLoading={false}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
