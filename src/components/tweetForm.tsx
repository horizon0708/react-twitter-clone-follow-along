import { Button, Input, makeStyles, Paper, TextField } from '@material-ui/core'
import React from 'react'
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { createTweet } from '../api/tweets';
import { Profile } from '../hooks/useProfile';
import { UserAvartar } from './userAvatar';

const useStyles = makeStyles((theme) => ({
    paper: {
      margin: "4em 0 0 0",
      padding: "16px",
      display: "flex",
      flexDirection: "row",
    },
    avatar: {
    },
    container: {
      margin: "0 0 0 1em",
      display: "flex",
      flexDirection: "column",
      alignItems: "end",
      justifyContent: "flex-end",
      width: "100%"
    },
    button: {
      textAlign: "right"
    },
    buttonContainer: {
      marginTop: "8px",
      display: "flex",
      justifyContent: "flex-end",
      width: "100%"
    }


  }));


export type TweetFormProps = {
  profile: Profile
}

export const TweetForm: React.FC<TweetFormProps> = ({ profile }) => {
    const classes = useStyles()
    const { username, avatar_url } = profile
    const { register, handleSubmit, errors } = useForm()
    const mutation = useMutation(createTweet)

    const onSubmit = (input: { tweet: string }) => {
      const { tweet } = input
      mutation.mutate({ userId: profile.id, content: tweet })
    }

    return <Paper variant="outlined" className={classes.paper}>
      <UserAvartar className={classes.avatar} name={username} path={avatar_url} />
      <form className={classes.container}>
        <TextField 
          name="tweet" 
          inputRef={register()} 
          placeholder="What's happening?" 
          variant="outlined" 
          fullWidth 
          multiline
          rows={4}
          />
        <div className={classes.buttonContainer}>
          <Button disableElevation variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)}>
            Tweet
          </Button>
        </div>
      </form>
    </Paper>
}