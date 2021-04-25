import { makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Redirect } from "react-router";
import { supabaseClient } from "../api/supabaseClient";
import { ProfileForm, ProfileFormProps } from '../components/profileForm';
import { PROFILES_TABLE } from "../constants";
import { useAuth } from '../contexts/authContext';

export type CreateProfilePageProps = {
};

const useStyles = makeStyles(theme => ({
  paper: {
      margin: "4em 0 0 0",
      padding: "6em 0 10em 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center", 
  }
}))

const EditProfilePage: React.FC<CreateProfilePageProps> = ({}) => {
  const classes = useStyles()
  const { session } = useAuth()
  const [saved, setSaved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);


  if(!session) {
      return <Redirect to={"/signup"}/>
  }

  const onSubmit: ProfileFormProps["onSubmit"] = async ({
    username,
    website,
  }) => {
    try {
        setSaved(false)
      setIsSubmitting(true);
      const { error } =await supabaseClient
        .from(PROFILES_TABLE).upsert({
        id: session?.user.id,
        username,
        website,
      });
      if(!error) {
        setSaved(true)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper variant="outlined" className={classes.paper}>
        <Typography variant="h5" align="center">
            Create Your Profile
        </Typography>
      <ProfileForm onSubmit={onSubmit} isSubmitting={isSubmitting} usernameExists={false} />
      {saved && <Typography>Saved!</Typography>}
    </Paper>
  );
};

export default EditProfilePage;
