import React, { useEffect, useState } from 'react'
import { supabaseClient } from '../api/supabaseClient'
import { TWEETS_TABLE } from '../constants'
import { useAuth } from '../contexts/authContext'

// alerts users that there are new tweets
export const useTweetSubscription = () => {
    const { user } = useAuth()
    const [newTweetAvailable, setNewTweetAvailable] = useState(false)

    useEffect(()=>{
        const { unsubscribe } = supabaseClient
            .from(TWEETS_TABLE)
            .on("INSERT", payload => {
                // Users' new tweets are optimistically updated
                // So no need to alert users to their own new tweets
                if(payload.new.userId !== user?.id) {
                    setNewTweetAvailable(true)
                }
            })
            .subscribe()
        return () => {
            try {
                // TODO: investigate why this throws on unmount
                unsubscribe()
            } catch (e) {
                console.error(0)
            }
        }
    }, [])


    return {
        newTweetAvailable,
        setNewTweetAvailable
    }
}