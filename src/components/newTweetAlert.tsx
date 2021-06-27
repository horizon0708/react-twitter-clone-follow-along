import { Button, Snackbar, SnackbarContent} from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles((t) => ({
    container: {
        margin: "1.5em 0 0.25em 0"
    },
  }))

type NewTweetAlertProps = {
    newTweetAvailable: boolean
    fetchNewTweets: () => void
}

export const NewTweetAlert: React.FC<NewTweetAlertProps> = ({ newTweetAvailable, fetchNewTweets }) => {
    const classes = useStyles()
    const action = (
        <Button color="primary" size="small" onClick={fetchNewTweets}>
            Refresh 
        </Button>
    )

    if(!newTweetAvailable) {
        return null
    }

    return <Alert
        severity="info"
        className={classes.container}
        action={action} 
        variant={"outlined"}
        >
            New tweets available
            </Alert>

}