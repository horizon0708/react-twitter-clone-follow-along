import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export type ProfileFormProps = {
  onSubmit: (e: { username: string; website: string }) => void;
  isSubmitting: boolean
  username?: string
  website?: string
  usernameExists: boolean
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, isSubmitting, username, website, usernameExists, children }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();

  return (
    <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
      <div>
        <TextField
          name="username"
          inputRef={register({
            required: "you must provide a unique username",
            minLength: {
              value: 3,
              message: "your username must be longer than 2 letters",
            },
          })}
          error={errors.username || usernameExists}
          helperText={errors?.username?.message || (usernameExists && "The username already exists")}
          label="Username"
          type="text"
          autoComplete="username"
          variant="outlined"
          defaultValue={username}
          disabled={isSubmitting}
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
          defaultValue={website}
          disabled={isSubmitting}
        />
      </div>
      <div>
        {children}
      </div>

      <Button 
        type="submit" 
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        >
          Submit
      </Button>
    </form>
  );
};
