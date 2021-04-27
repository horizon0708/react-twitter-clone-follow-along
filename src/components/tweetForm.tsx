import { makeStyles, Paper } from '@material-ui/core'
import React from 'react'

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


export type TweetFormProps = {

}

export const TweetForm: React.FC<TweetFormProps> = () => {
    const classes = useStyles()

    return <Paper variant="outlined" className={classes.paper}>
          
    </Paper>
}