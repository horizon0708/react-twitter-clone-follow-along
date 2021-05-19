import { Card, CircularProgress, makeStyles } from '@material-ui/core'
import React from 'react'
import { useQuery } from 'react-query'
import { fetchTweets } from '../api/tweets'
import { useAuth } from '../contexts/authContext'
import { TweetCard } from './tweetCard'

const useStyles = makeStyles(t => ({
    paper: {
        marginTop: "4em",
        padding: "6em 0 6em 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
            margin: "0.3em 0 0.3em 0"
        }
    },
    container: {
        marginTop: "4em",
        padding: "6em 0 6em 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
}))

export type TweetListProps = {
    userIdToFilterBy?: string
}

export const TweetList: React.FC<TweetListProps>= ({ userIdToFilterBy }) => {
    const classes = useStyles()
    const { session } = useAuth()
    const { isLoading, isError, data, error } = useQuery(['tweets', session?.user?.id, userIdToFilterBy], fetchTweets)

    if(isLoading) {
        return <div className={classes.container}>
            <CircularProgress />
        </div>
    }

    if(isError || !data) {
        return <Card className={classes.container}>

        </Card>
    }

    const onFavoriteToggle = (tweetId: number, userId?:string) => {

    }

    return (
        <>
            {data.map(tweet => {
                return (
                    <TweetCard key={tweet.id} tweet={tweet} userId={session?.user?.id} onFavoriteToggle={onFavoriteToggle}/>
                )
            })}
        </>
    )
}