import React from 'react'
import { useQueryClient } from 'react-query'
import { supabaseClient } from '../api/supabaseClient'
import { Tweet } from '../api/tweets'
import { TWEETS_TABLE } from '../constants'
import { useAuth } from '../contexts/authContext'


export const useTweetSubscription = (userIdToFilterBy?: string) => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    supabaseClient
        .from(TWEETS_TABLE)
        .on("INSERT", payload => {
            // const previousTweets = queryClient.getQueryData(["tweets", user?.id, userIdToFilterBy])
            // console.log(previousTweets, user?.id, userIdToFilterBy)

            // queryClient.setQueryData<Tweet[]>(["tweets", user?.id, userIdToFilterBy], old => {
            //     if(old && old.findIndex(o => o.id === payload.new.id)) {
            //         return [...old, payload.new]
            //     }
            //     return [ payload.new ]
            // })
        })
        .subscribe()
}