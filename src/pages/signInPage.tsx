import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import { supabaseClient } from "../api/supabaseClient";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { Paper, Typography } from "@material-ui/core";
import Link from "@material-ui/core/Link";

// from https://emailregex.com/
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const useStyles = makeStyles((theme) => ({
  form: {
    width: 300,
    margin: "2em 0 0 0",
    "& > div": {
      margin: "0.6em 0 0.75em 0"
    }
  },
  otherActionsContainer: {
    textAlign: "right",
  },
  paper: {
    marginTop: "4em",
    padding: "6em 0 10em 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const SignInPage = () => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();

  // look for `redirectUri` query, so we can redirect users back to the page they were on
  const redirectUri = new URLSearchParams(window.location.search).get(
    "redirectUri"
  );

  // we can use `push()` in history to redirect users too
  const history = useHistory();

  const onSubmit = async ({ email, password }: any) => {
    // sign the user in
    const { error } = await supabaseClient.auth.signIn({
      email,
      password,
    });
    if (error) {
      // probably should tell the user about the error, but lets implement that later
      console.error(error);
      return;
    }

    // then redirect them to the page they were on, or the root page.
    history.push(redirectUri || "/");
  };

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Typography variant="h5" align="center">
        Sign in to SupaTwitter
      </Typography>
      <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
        <div>
          <TextField
            name="email"
            inputRef={register({
              required: "You must provide an email",
              pattern: emailRegex,
            })}
            error={errors.email}
            helperText={errors?.email?.message}
            label="Email"
            type="email"
            autoComplete="email"
            variant="outlined"
            fullWidth
          />
        </div>
        <div>
          <TextField
            name="password"
            inputRef={register({
              required: "You must provide a password",
            })}
            error={errors.password}
            helperText={errors?.password?.message}
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            fullWidth
          />
        </div>

        <div>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
            size="large"
            disableElevation
            fullWidth
          >
            Sign In
          </Button>
        </div>

        <div className={classes.otherActionsContainer}>
          <Link
            underline="none"
            to="/signup"
            component={RouterLink}
            color="inherit"
          >
            <Button color="inherit">Sign up</Button>
          </Link>
        </div>
      </form>
    </Paper>
  );
};

export default SignInPage
