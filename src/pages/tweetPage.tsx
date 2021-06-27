import React, { useState } from 'react'
import { InfiniteData, useMutation, useQuery, useQueryClient } from 'react-query'
import { fetchProfileById } from '../api/profiles'
import { createTweet, fromRawTweetToTweet, fromTweetRequestToTweet, TweetResponse } from '../api/tweets'
import { TweetForm } from '../components/tweetForm'
import { TweetList } from '../components/tweetList'
import { useAuth } from '../contexts/authContext'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(()=> ({
    container: {
        margin: "4em 0 4em 0"
    }
}))

export const TweetPage = () => {
    const classes = useStyles();
    const { user } = useAuth()
    const { isLoading, isError, data, error } = useQuery(['profile', user?.id], async ()=> {
        return await fetchProfileById(user!.id)
    }, {
        enabled: !!user?.id,
        staleTime: 3600
    })
    const queryClient = useQueryClient()

    const mutation = useMutation(createTweet, {
        onMutate: (tweet) => {
            if(tweet) {
                queryClient.setQueryData<InfiniteData<TweetResponse>>(['tweets', user?.id, undefined], old => {
                    const newTweet = fromTweetRequestToTweet(tweet, data!) 
                    if(old?.pages && !!old.pages.length) {
                        const [head, ...rest] = old.pages
                        const pages = [
                            {
                                ...head,
                                tweets: [
                                    newTweet,
                                    ...head.tweets
                                ],
                            },
                            ...rest
                        ] 
                        return {
                            pages,
                            pageParams: old.pageParams,
                        }
                    }
                    const pages = [ {
                        tweets: [ newTweet ],
                        next: newTweet.createdAt,
                        previous: newTweet.createdAt,
                        hasBeenAddedByMutate: true
                    } ]
                    return {
                        pages,
                        pageParams: old?.pageParams || []
                    }
                })
            }
        }
      })

    return (
        <div className={classes.container}>
            { data ? <TweetForm profile={data} submit={mutation.mutate} />: null }
            <TweetList />
        </div>
    )
}