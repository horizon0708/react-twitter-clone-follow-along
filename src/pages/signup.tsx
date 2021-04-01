import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export const SignUpPage = () => {
  const classes = useStyles();
  const onSubmit = () => {
    alert(`signed up!`) 
  };

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <div>
        <TextField
          id="email-input"
          label="Email"
          type="email"
          autoComplete="email"
          variant="outlined"
        />
      </div>
      <div>
        <TextField
          id="password-input"
          label="Password"
          type="password"
          autoComplete="new-password"
          variant="outlined"
        />
      </div>
      <div>
        <TextField
          id="password-confirm"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          variant="outlined"
        />
      </div>

        <Button type="submit">
            Sign up
        </Button> 
    </form>
  );
};
