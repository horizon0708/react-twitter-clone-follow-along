import React from 'react'
import { InfiniteData, useMutation, useQueryClient } from 'react-query'
import { toggleFavorite } from '../api/favorites'
import { TweetResponse } from '../api/tweets'
import { useAuth } from '../contexts/authContext'

export const useToggleFavorite = (userIdToFilterBy?: string) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (tweetId: number) =>
      user && (await toggleFavorite(user?.id, tweetId)),
    {
      // optimistic updating, no need to make another fetch call
      onMutate: (tweetId) => {
        queryClient.setQueryData<InfiniteData<TweetResponse>>(
          ['tweets', user?.id, userIdToFilterBy],
          (data) => {
            if (!data) {
              return {
                pages: [],
                pageParams: [],
              }
            }

            // Lenses or Immer would be nice here
            return {
              ...data,
              pages: data.pages.map((page) => {
                return {
                  ...page,
                  tweets: page.tweets.map((tweet) => {
                    if (tweet.id !== tweetId) {
                      return {
                        ...tweet,
                      }
                    }

                    return {
                      ...tweet,
                      isFavorited: !tweet.isFavorited,
                      // hindsight, I should have limited Tweet's API to favoritedBy
                      // and derived favorites and isFavorited from that - that would have made this much
                      // easier and cleaner
                      favorites: tweet.isFavorited
                        ? tweet.favorites - 1
                        : tweet.favorites + 1,
                    }
                  }),
                }
              }),
            }
          },
        )
      },
    },
  )

  return mutation.mutate
}
