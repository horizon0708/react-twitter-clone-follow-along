import React from 'react'
import { useQuery } from 'react-query'
import { fetchProfileById } from '../api/profiles'
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
    return (
        <>
            { data ? <TweetForm profile={data} />: null }
            <TweetList />
        </>
    )
}