import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  form: {
    width: 300,
    margin: "2em 0 0 0",
    "& > div": {
      margin: "0.6em 0 0.6em 0",
    },
  },
}));

export type ProfileInput = {
    username: string
    website?: string
}

export type ProfileFormProps = {
  onSubmit: (e: ProfileInput ) => void;
  isSubmitting: boolean
  username?: string
  website?: string
  usernameExists: boolean
  className?: string
  submitText?: string
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, isSubmitting, username, website, usernameExists, children, className, submitText }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();

  return (
    <form className={`${classes.form} ${className}`} onSubmit={(e) => e.preventDefault()}>
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
          error={!!errors.username || usernameExists}
          helperText={errors?.username?.message || (usernameExists && "The username already exists")}
          label="Username"
          type="text"
          autoComplete="username"
          variant="outlined"
          fullWidth
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
          fullWidth
          defaultValue={website}
          disabled={isSubmitting}
        />
      </div>

      <Button 
        type="submit" 
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        >
          {submitText ?? "Submit"} 
      </Button>
    </form>
  );
};
