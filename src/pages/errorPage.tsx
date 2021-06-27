import { Paper, makeStyles, Typography } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import React from 'react'

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


export const ErrorPage = () => {
    const classes = useStyles()

    return (
        <Paper variant="outlined" className={classes.container}>
            <ErrorIcon style={{fontSize: 60}} />            
            <Typography>
                Oops! Something went wrong. Please try again.
            </Typography>
        </Paper>
    )
}