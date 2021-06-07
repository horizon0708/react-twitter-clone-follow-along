import dayjs from 'dayjs';
import { QueryFunction } from 'react-query';
import { supabaseClient } from '../api/supabaseClient';
import { TWEETS_TABLE } from '../constants';
import { Profile } from '../hooks/useProfile';
import { definitions } from './types';

type TweetResponse = {
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
    content: string
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

export const fetchTweets: QueryFunction<Tweet[], [string, string | undefined, string | undefined]> = async ({ queryKey }) => {
    const [_key, loggedInUserId, userIdToFilterTweetsBy] = queryKey

    console.log("Fetch tweet called", loggedInUserId, userIdToFilterTweetsBy)
    const query =  userIdToFilterTweetsBy ? 
        supabaseClient.rpc<TweetResponse>('get_tweets', { u_id: userIdToFilterTweetsBy }).order("createdat", { ascending: false }) :
        supabaseClient.rpc<TweetResponse>('get_tweets').order("createdat", { ascending: false })

    let { data, error } = await query

    if(error) {
        throw new Error(error.message);
    } 
    if(!data) {
        return []
    }

    return data.map(fromResponseToTweet(loggedInUserId as string | undefined))
}

const fromResponseToTweet = (loggedInUserId?: string, )=>(response: TweetResponse): Tweet => {
    const { id, content, createdat, favorited_users, tweet_author } = response;
    return {
        id,
        content,
        createdAt: dayjs(createdat).format(`DD MMM`),
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

export const createTweet = async (tweet: AddTweetRequestBody) => {
    const { data, error } = await supabaseClient
        .from<RawTweet>(TWEETS_TABLE)
        .insert(tweet)
   
    if(error) {
        throw new Error(error.message)
    }

    return data || []
}