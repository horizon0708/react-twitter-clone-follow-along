import { makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react"
import { useAuth } from '../contexts/authContext';
import { useProfile } from '../hooks/useProfile';
import { PageLoading } from '../components/pageLoading';
import { UserAvartar } from '../components/userAvatar';
import ErrorIcon from '@material-ui/icons/Error';
import { Redirect } from "react-router-dom";
import { TweetList } from "../components/tweetList";

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
    const { user } = useAuth()

    let userIdQuery = new URLSearchParams(window.location.search).get(
        "userId"
    )

    const [profile, profileError, profileLoading] = useProfile("id", userIdQuery || user?.id)

    if(!user && !userIdQuery) {
        return <Redirect to="/signin" />
    }

    if(profileLoading) {
        return <PageLoading />
    }

    if(profileError) {
        return <Redirect to="/error" />
    }

    // if they were querying for a user and that user does not exist, display an error page
    if(userIdQuery && !profile) {
        return (
            <Paper variant="outlined" className={classes.paper}>
                <ErrorIcon style={{fontSize: 60}} />            
                <Typography>
                    The user ({userIdQuery}) does not exist!
                </Typography>
            </Paper>
        )
    } 

    // if they are trying to view their own profile (no userId query)
    // and they were logged in, redirect them to edit page to set up their profile
    if(!profile) {
        // if the user is logged in, redirect them to set up their profile
        if(user) {
            return <Redirect to="/profile/edit" />
        } else {
            // otherwise to sign in page
            return <Redirect to="/signin" />
        }
    }

    return (
        <>
            <Paper variant="outlined" className={classes.paper}>
                <UserAvartar name={profile.username} path={profile.avatar_url} className={classes.avatar} />
                <Typography variant="h5" align="center">
                    {profile.username}
                </Typography>
            </Paper>
            <TweetList userIdToFilterBy={profile.id}/>
        </>
    )
}