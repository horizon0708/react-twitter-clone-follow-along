import React from 'react'
import { TweetForm } from '../components/tweetForm'
import { TweetList } from '../components/tweetList'

export const TweetPage = () => {
    return (
        <>
            <TweetForm />
            <TweetList />
        </>
    )
}