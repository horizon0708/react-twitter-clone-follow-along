import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { fetchProfileById } from '../api/profiles'
import { createTweet, fromRawTweetToTweet, Tweet } from '../api/tweets'
import { TweetForm } from '../components/tweetForm'
import { TweetList } from '../components/tweetList'
import { useAuth } from '../contexts/authContext'

export const TweetPage = () => {
    const { user } = useAuth()
    const { isLoading, isError, data, error } = useQuery(['profile', user?.id], async ()=> {
        return await fetchProfileById(user!.id)
    }, {
        enabled: !!user?.id,
        staleTime: 3600
    })
    const queryClient = useQueryClient()

    const mutation = useMutation(createTweet, {
        onSettled: (tweets) => {
            if(tweets && tweets.length) {
                queryClient.setQueryData<Tweet[]>(['tweets', user?.id, undefined], old => {
                    const newTweet = fromRawTweetToTweet(tweets[0], data!) 
                    if(old) {
                        return [ newTweet, ...old]
                    }
                    return [ newTweet]
                })
            }
        }
      })

    return (
        <>
            { data ? <TweetForm profile={data} submit={mutation.mutate} />: null }
            <TweetList />
        </>
    )
}