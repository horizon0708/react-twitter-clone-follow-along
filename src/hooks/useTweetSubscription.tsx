import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { supabaseClient } from '../api/supabaseClient'
import { Tweet } from '../api/tweets'
import { TWEETS_TABLE } from '../constants'
import { useAuth } from '../contexts/authContext'

// alerts users that there are new tweets
export const useTweetSubscription = (userIdToFilterBy?: string) => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const getTimestamp = () => {
        const tweets = queryClient.getQueryData<Tweet[]>(['tweets', user?.id, userIdToFilterBy, undefined])
        if(tweets && !!tweets.length) {
            return dayjs(tweets[0].createdAt)
        } 
        return undefined
    }

    const { refetch } = useQuery(['tweets', user?.id, userIdToFilterBy, getTimestamp()], async () => {

    }, {
        enabled: false
    })


    let newTweetAvailable = false

    useEffect(()=>{
        const { unsubscribe } = supabaseClient
            .from(TWEETS_TABLE)
            .on("INSERT", payload => {
                newTweetAvailable = true;
            })
            .subscribe()

        return () => {
            unsubscribe()
        }
    }, [])



    return {
        newTweetAvailable
    }
}