import { Card, CircularProgress, makeStyles } from '@material-ui/core'
import React from 'react'
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from 'react-query'
import { toggleFavorite } from '../api/favorites'
import { fetchTweets, TweetResponse } from '../api/tweets'
import { useAuth } from '../contexts/authContext'
import { useToggleFavorite } from '../hooks/useToggleFavorite'
import { useTweetInfiniteQuery } from '../hooks/useTweetInfiniteQuery'
import { useTweetSubscription } from '../hooks/useTweetSubscription'
import { FetchOlderTweetsButton } from './fetchOlderTweetsButton'
import { NewTweetAlert } from './newTweetAlert'
import { TweetCard } from './tweetCard'

const useStyles = makeStyles((t) => ({
  paper: {
    marginTop: '4em',
    padding: '6em 0 6em 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: '0.3em 0 0.3em 0',
    },
  },
  container: {
    marginTop: '4em',
    padding: '6em 0 6em 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

export type TweetListProps = {
  userIdToFilterBy?: string
}

export const TweetList: React.FC<TweetListProps> = ({ userIdToFilterBy }) => {
  const classes = useStyles()
  const { user } = useAuth()
  const onFavoriteToggle = useToggleFavorite(userIdToFilterBy)
  const {
    data,
    isLoading,
    isError,
    hasNewerTweets,
    hasOlderTweets,
    isFetchingNewTweets,
    isFetchingOlderTweets,
    fetchNewerTweets,
    fetchOlderTweets
  } = useTweetInfiniteQuery(userIdToFilterBy)

  if (isLoading) {
    return (
      <div className={classes.container}>
        <CircularProgress />
      </div>
    )
  }

  if (isError || !data) {
    return <Card className={classes.container}></Card>
  }

  return (
    <>
      <NewTweetAlert newTweetAvailable={hasNewerTweets} fetchNewTweets={fetchNewerTweets} />
      {isFetchingNewTweets && <div className={classes.container}>
        <CircularProgress />
      </div>}
      {data.pages.map((group, i) => {
        return (
          <React.Fragment key={i}>
            {group.tweets.map((tweet) => {
              return (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  f={tweet.isFavorited}
                  userId={user?.id}
                  onFavoriteToggle={onFavoriteToggle}
                />
              )
            })}
          </React.Fragment>
        )
      })}
      <FetchOlderTweetsButton 
        hasPreviousPage={hasOlderTweets} 
        fetchOlderTweets={fetchOlderTweets} 
        isLoading={isFetchingOlderTweets}
        />
    </>
  )
}
