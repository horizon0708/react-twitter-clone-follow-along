import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import { supabaseClient } from "../api/supabaseClient";

// from https://emailregex.com/
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export const SignInPage = () => {
  const classes = useStyles();
  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = ({ email, password }: any) => {
    supabaseClient.auth.signIn({
      email,
      password,
    }).then(res => {
        console.log(res.user)
    }).catch(err => {
        console.error(err)
    });
  };

  return (
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
        />
      </div>
      <div>
        <TextField
          name="password"
          inputRef={register({
            required: "You must provide a password"
          })}
          error={errors.password}
          helperText={errors?.password?.message}
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"
        />
      </div>

      <Button type="submit" onClick={handleSubmit(onSubmit)}>
        Sign In
      </Button>
    </form>
  );
};
