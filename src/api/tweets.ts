import dayjs from 'dayjs';
import { QueryFunction } from 'react-query';
import { supabaseClient } from '../api/supabaseClient';
import { TWEETS_TABLE } from '../constants';
import { Profile } from '../hooks/useProfile';
import { getRandomInt } from '../util/random';
import { definitions } from './types';

type TweetServerResponse = {
    id: number
    content: string
    createdat: string,
    favorited_users: { id: string, username: string }[]
    tweet_author: definitions["profiles"] 
} 

export type Tweet = {
    id: number
    isFavorited: boolean
    favorites: number
    favoritedBy: definitions["profiles"][]
    author: definitions["profiles"]
    createdAt: string
    content: string,
    hasBeenAddedByMutate?: boolean 
}

export type RawTweet = {
    id: number,
    createdAt: string,
    userId: string,
    content: string
}

export type AddTweetRequestBody = {
    userId: string
    content: string
}

export type TweetResponse = {
    tweets: Tweet[]
    next?: string
    previous?: string
}

export const fetchTweets: QueryFunction<TweetResponse, [string, string | undefined, string | undefined]> = async ({ queryKey, pageParam }) => {
    const [_key, loggedInUserId, userIdToFilterTweetsBy] = queryKey
    const { to, from } = pageParam || {}

    const params = { 
        u_id: userIdToFilterTweetsBy || null, 
        t_from: from,
        t_to: to
    }
    console.warn("I've been called?", queryKey)

    // if we are getting results 'from' a set point in time, we want to get
    // 20 messages 'from' that time, rather than the latest 20.
    // because if we get the latest 20, we will be missing some tweets between.  
    // 
    // There is definitely no right way here, depends on what kind of experience 
    // you are trying to give your users. 
    // 
    // The main problem I see with this approach is that users' refreshes may _NEVER_
    // catch up to the latest, if the rate of new tweet > the pagination limit.
    // 
    // Twitter circumvents this problem as their feed isn't chronological.
    const ascending = !!from 

    const query = supabaseClient
        .rpc<TweetServerResponse>('get_tweets', params)
        .order("createdat", { ascending })
        .limit(20)

    let { data, error } = await query

    if(error) {
        throw new Error(error.message);
    } 
    if(!data) {
        return {
            tweets: []
        }
    }

    let output: TweetResponse = {
        tweets: data.map(fromResponseToTweet(loggedInUserId as string | undefined)),
    }

    if(data.length) {
        // initial query
        if(!to && !from) {
            output.next = data[0].createdat
            output.previous = data[data.length -1].createdat
        } 

        // we are going back in time
        if(to && !from) {
            output.previous = data[data.length -1].createdat
        }

        // we are fetching new posts here
        if(from && !to) {
            output.next = data[0].createdat
        }
    }

    return output
}

const fromResponseToTweet = (loggedInUserId?: string, )=>(response: TweetServerResponse): Tweet => {
    const { id, content, createdat, favorited_users, tweet_author } = response;
    return {
        id,
        content,
        createdAt: createdat,
        favoritedBy: favorited_users,
        author: tweet_author,
        isFavorited: favorited_users?.findIndex(u => u.id === loggedInUserId) > -1,
        favorites: favorited_users ? favorited_users.length : 0
    }    
}

export const fromRawTweetToTweet = (rawTweet: RawTweet, user: Profile) => {
    const { createdAt, content, id } = rawTweet
    return {
        id,
        content,
        createdAt: dayjs(createdAt).format("DD MMM"),
        favoritedBy: [],
        author: user,
        isFavorited: false,
        favorites: 0
    }
}

export const fromTweetRequestToTweet = (rawTweet: AddTweetRequestBody, user: Profile) => {
    const { content } = rawTweet
    return {
        id: getRandomInt(99999, 10000000),
        content,
        createdAt: dayjs().format("DD MMM HH:MM"),
        favoritedBy: [],
        author: user,
        isFavorited: false,
        favorites: 0,
        hasBeenAddedByMutate: true
    }
}

export const createTweet = async (tweet: AddTweetRequestBody) => {
    const { data, error } = await supabaseClient
        .from<RawTweet>(TWEETS_TABLE)
        .insert(tweet)
   
    if(error) {
        throw new Error(error.message)
    }

    return data || []
}
