import React from 'react'
import { useInfiniteQuery, useQueryClient, InfiniteData } from 'react-query'
import { fetchTweets, TweetResponse } from '../api/tweets'
import { useAuth } from '../contexts/authContext'
import { useTweetSubscription } from './useTweetSubscription'

export const useTweetInfiniteQuery = (userIdToFilterBy?: string) => {
    const { user } = useAuth()
    const { newTweetAvailable, setNewTweetAvailable } = useTweetSubscription()
    const queryClient = useQueryClient()

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
    
    return {
        isLoading,
        isError,
        data,

        fetchNewerTweets: ()=> fetchNext(),
        isFetchingNewTweets: isFetchingNextPage,
        hasNewerTweets: newTweetAvailable,

        fetchOlderTweets: ()=> fetchPreviousPage(),
        isFetchingOlderTweets: isFetchingPreviousPage,
        hasOlderTweets: hasPreviousPage,
    }
}