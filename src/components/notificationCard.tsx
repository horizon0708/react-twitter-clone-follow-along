import { Card, CardHeader, createStyles, makeStyles } from '@material-ui/core';
import React from 'react'
import { UserAvartar } from './userAvatar';

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      borderColor: theme.palette.primary.main,
    }
  }),
);

export type NotificationCardProps = {
    avatarUrl?: string
    username: string
    at: string
    content: string
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ avatarUrl, username, at, content}) => {
    const classes = useStyles();

    return <Card variant="outlined" className={classes.card}>
        <CardHeader 
            avatar={<UserAvartar path={avatarUrl} name={username}/>}
            title={`${username} liked your tweet!`}
            subheader={at}
        />
    </Card> 
}

