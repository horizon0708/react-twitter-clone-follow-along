import { Paper, makeStyles, Typography } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import React from 'react'
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(t => ({
    container: {
        marginTop: "4em",
        padding: "6em 0 6em 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
            margin: "0.3em 0 0.3em 0"
        }
    }
}))


export const ConfirmEmailPage = () => {
    const classes = useStyles()
    let email = new URLSearchParams(window.location.search).get(
        "email"
    )

    if(!email) {
        return <Redirect to="/error" />
    }
    email = decodeURIComponent(email)

    return (
        <Paper variant="outlined" className={classes.container}>
            <MailIcon style={{fontSize: 60}}/>            
            <Typography align="center">
                {`We've sent an email to ${email} to confirm your sign up.`}
            </Typography>
        </Paper>
    )
}