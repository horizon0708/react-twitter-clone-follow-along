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
  const { newTweetAvailable, setNewTweetAvailable } = useTweetSubscription()
  const {
    isLoading,
    isError,
    data,
    fetchPreviousPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    hasPreviousPage,
  } = useInfiniteQuery(['tweets', user?.id, userIdToFilterBy], fetchTweets, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.next ? { from: lastPage.next } : null
    },
    getPreviousPageParam: (lastPage, pages) => {
      return lastPage?.previous ? { to: lastPage.previous } : null
    },
    select: (data) => {
      return {
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }
    },
    staleTime: 1000 * 60 * 5, // 5min
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
  const queryClient = useQueryClient()

  const fetchNext = () => {
    fetchNextPage().then(() => {
      //get rid of duplicate tweets that got added by optimistic updates
      queryClient.setQueryData<InfiniteData<TweetResponse>>(
        ['tweets', user?.id, userIdToFilterBy],
        (data) => ({
          pages:
            data?.pages.map((x) => ({
              ...x,
              tweets: x.tweets.filter((x) => !x.hasBeenAddedByMutate),
            })) || [],
          pageParams: data?.pageParams || [],
        }),
      )
    })
    setNewTweetAvailable(false)
  }

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

  const onFavoriteToggle = (tweetId: number, userId?: string) => {
    if(userId) {
      toggleFavorite(userId, tweetId)

      //optimistically updating after toggling
      queryClient.setQueryData<InfiniteData<TweetResponse>>(
        ['tweets', user?.id, userIdToFilterBy],
        (data) => {
          if(!data) {
            return {
              pages: [],
              pageParams: []
            }
          }

          // Lenses or Immer would be nice here
          return {
            ...data,
            pages: data.pages.map(page => {
              return {
                ...page,
                tweets: page.tweets.map(tweet => {
                  if(tweet.id !== tweetId) {
                    return {
                      ...tweet
                    }
                  }

                  return {
                    ...tweet,
                    isFavorited: !tweet.isFavorited, 
                    // hindsight, I should have limited Tweet's API to favoritedBy
                    // and derived favorites and isFavorited from that - that would have made this much
                    // easier and cleaner
                    favorites: tweet.isFavorited ? tweet.favorites - 1 : tweet.favorites + 1
                  }
                })
              }
            })
          }
        }
      )
    }
  }

  return (
    <>
      <NewTweetAlert newTweetAvailable={newTweetAvailable} fetchNewTweets={()=> fetchNext()} />
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
        hasPreviousPage={hasPreviousPage} 
        fetchOlderTweets={()=> fetchPreviousPage()} 
        isLoading={isFetchingPreviousPage}
        />
    </>
  )
}
