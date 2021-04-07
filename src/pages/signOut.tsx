import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { supabaseClient } from "../api/supabaseClient";

export const SignOutPage = () => {
    useEffect(()=> {
        supabaseClient.auth.signOut()
    },[])    

    return <div>
        You've been signed out.
        <Link to="/">
            <Button>
                Go to home page
            </Button>
        </Link>
        <Link to="/signin">
            <Button>
                Sign in
            </Button>
        </Link>
    </div>
}