import { Button, Link, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { supabaseClient } from "../api/supabaseClient";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "4em 0 0 0",
    padding: "6em 0 10em 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: "0.6em 0 0.6em 0"
    }
  },
  actionsContainer: {
    margin: "1em 0 0 0",
  },
}));

export const SignOutPage = () => {
  const classes = useStyles();
  useEffect(() => {
    supabaseClient.auth.signOut().then(console.log);
  }, []);

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Typography variant="h5" align="center">
        You've been signed out
      </Typography>
      <div >
        <Link underline="none" to="/" component={RouterLink} color="inherit">
          <Button color="inherit">Go to Home Page</Button>
        </Link>
        <Link
          underline="none"
          to="/signin"
          component={RouterLink}
          color="inherit"
        >
          <Button color="inherit">Sign In</Button>
        </Link>
      </div>
    </Paper>
  );
};
