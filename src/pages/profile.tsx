import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import { supabaseClient } from "../api/supabaseClient";

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export const ProfilePage = () => {
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
          name="username"
          inputRef={register({
            required: "you must provide a unique username",
            minLength: {
                value: 3,
                message: "your username must be longer than 2 letters"
            }
          })}
          error={errors.username}
          helperText={errors?.username?.message}
          label="Username"
          type="text"
          autoComplete="username"
          variant="outlined"
        />
      </div>
      <div>
        <TextField
          name="website"
          inputRef={register()}
          label="Website"
          type="website"
          autoComplete="website"
          variant="outlined"
        />
      </div>

      <Button type="submit" onClick={handleSubmit(onSubmit)}>
        Sign In
      </Button>
    </form>
  );
};
