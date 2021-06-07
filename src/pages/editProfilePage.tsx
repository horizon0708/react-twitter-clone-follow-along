import { makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Redirect } from "react-router";
import { supabaseClient } from "../api/supabaseClient";
import { ProfileForm, ProfileFormProps } from "../components/profileForm";
import { PROFILES_TABLE } from "../constants";
import { useAuth } from "../contexts/authContext";
import { useProfile } from "../hooks/useProfile";
import { PageLoading } from "../components/pageLoading";
import { UploadButton } from '../components/uploadButton';
import { useUpload } from '../hooks/useUpload';
import { definitions } from '../api/types';
import { UserAvartar } from '../components/userAvatar';

export type CreateProfilePageProps = {};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "4em 0 0 0",
    padding: "6em 0 6em 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: "1.5em 0 1em 0",
    width: "8em",
    height: "8em"
  }
}));

const EditProfilePage: React.FC<CreateProfilePageProps> = ({}) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, profileError, profileLoading] = useProfile("id", user?.id);
  const [usernameExists, setUsernameExists] = useState(false)
  const [onUpload, uploadedAvatarUrl, uploadError, isUploading] = useUpload(user)

  if (!user) {
    return <Redirect to={"/signin"} />;
  }

  if (profileLoading) {
    return <PageLoading />;
  }

  const onSubmit: ProfileFormProps["onSubmit"] = async ({
    username,
    website,
  }) => {
    setUsernameExists(false)
    setSaved(false);
    setIsSubmitting(true);
    const { error } = await supabaseClient.from<definitions["profiles"]>(PROFILES_TABLE).upsert({
      id: user?.id,
      username,
      website,
      avatar_url: uploadedAvatarUrl ?? undefined
    });

    if (!error) {
      setSaved(true);
    } else { 
        if(error.code === "23505") { // duplicate key value violates unique constraint
            setUsernameExists(true)
        }
    } 
    setIsSubmitting(false);
  };

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Typography variant="h5" align="center">
        {profile ? "Edit Your Profile" : "Create Your Profile"}
      </Typography>
      <UserAvartar name={profile?.username || user?.email} path={uploadedAvatarUrl || profile?.avatar_url} className={classes.avatar} />
      <UploadButton onUpload={onUpload} />
      <ProfileForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        usernameExists={usernameExists}
        username={profile?.username}
        website={profile?.website}
      >
      </ProfileForm>
      {saved && <Typography>Saved!</Typography>}
    </Paper>
  );
};

export default EditProfilePage;
