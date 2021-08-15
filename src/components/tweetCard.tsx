import { Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { Tweet } from '../api/tweets'
import { UserAvartar } from './userAvatar'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { toDateAndMonth } from '../util/dates';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "0.3em 0 0.3em 0",
    display: 'flex',
    flexDirection: 'column',
  },
  avatar: {
    margin: '0 0 1em 0',
    width: '8em',
    height: '8em',
  },
}))

export type TweetCardProps = {
  tweet: Tweet,
  f?: boolean
  onFavoriteToggle: (tweetId: number) => void
  userId?: string
}

export const TweetCard: React.FC<TweetCardProps> = ({ tweet, f, onFavoriteToggle, userId }) => {
  const classes = useStyles()
  const { id, author, favoritedBy, favorites, isFavorited,content, createdAt } = tweet;
  return (
    <Card variant="outlined" className={classes.paper}>
      <CardHeader
        avatar={
          <UserAvartar path={author.avatar_url} name={author.username}/> 
        }
        title={author.username}
        subheader={toDateAndMonth(createdAt)}
      />
      <CardContent>
        {content}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="toggle favorite for this tweet" onClick={()=> onFavoriteToggle(id)}>
          {
            isFavorited ? 
              <FavoriteIcon /> :
              <FavoriteBorderOutlinedIcon />
          }
        </IconButton>
        <Typography>
          {favorites}
        </Typography>
      </CardActions>
    </Card>
  )
}
