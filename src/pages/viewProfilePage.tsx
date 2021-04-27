import { makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react"
import { useAuth } from '../contexts/authContext';
import { useProfile } from '../hooks/useProfile';
import { PageLoading } from '../components/pageLoading';
import { UserAvartar } from '../components/userAvatar';
import ErrorIcon from '@material-ui/icons/Error';
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
      margin: "4em 0 0 0",
      padding: "3em 0 3em 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: "0 0 1em 0",
      width: "8em",
      height: "8em"
    }
  }));

export const ViewProfilePage: React.FC<{}> = ({}) => {
    const classes = useStyles()
    const { session } = useAuth()
    const [profile, profileError, profileLoading] = useProfile("id", session?.user.id)

    if(profileLoading) {
        return <PageLoading />
    }

    if(!profile) {
        return <Redirect to="/profile/edit" />
    }

    return (
        <Paper variant="outlined" className={classes.paper}>
            <UserAvartar name={profile.username} avatarUrl={profile.avatar_url} className={classes.avatar} />
            <Typography variant="h5" align="center">
                {profile.username}
            </Typography>
        </Paper>
    )
}