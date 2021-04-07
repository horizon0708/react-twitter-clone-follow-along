import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { SignUpPage } from "./pages/signUp";
import { UploadButton } from "./components/uploadButton";
import CreateProfilePage from "./pages/createProfile";
import EditProfilePage from './pages/editProfile'
import SignInPage from "./pages/signIn";
import { supabaseClient } from "./api/supabaseClient";
import { SignOutPage } from "./pages/signOut";
import { AuthProvider } from "./contexts/authContext";

function App() {
  const session = supabaseClient.auth.session()
  console.log(session)
  return (
    <AuthProvider>
    <Router>
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
        <Route path="/profile/create">
          <CreateProfilePage />
        </Route>
        <Route path="/profile/edit">
          <EditProfilePage /> 
        </Route>
        <Route path="/profile">view</Route>
        <Route path="/">
          Home
          <UploadButton onUpload={() => {}} isLoading={false} />
        </Route>
      </Switch>
    </Router>
    </AuthProvider>
  );
}

export default App;
