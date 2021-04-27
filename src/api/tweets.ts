import dayjs from 'dayjs';
import { QueryFunction } from 'react-query';
import { supabaseClient } from '../api/supabaseClient';
import { TWEETS_TABLE } from '../constants';
import { definitions } from './types';

type TweetResponse = {
    id: number
    content: string
    createdAt: string,
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

type AddTweetRequestBody = {
    userId: string
    content: string
}

export const fetchTweets: QueryFunction<Tweet[], [string, string | undefined, string | undefined]> = async ({ queryKey }) => {
    const [_key, loggedInUserId, userIdToFilterTweetsBy] = queryKey

    const query =  userIdToFilterTweetsBy ? 
        supabaseClient.rpc<TweetResponse>('get_tweets', { u_id: userIdToFilterTweetsBy }) :
        supabaseClient.rpc<TweetResponse>('get_tweets')

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
    const { id, content, createdAt, favorited_users, tweet_author } = response;
    return {
        id,
        content,
        createdAt: dayjs(createdAt).format(`DD MMM`),
        favoritedBy: favorited_users,
        author: tweet_author,
        isFavorited: favorited_users?.findIndex(u => u.id === loggedInUserId) > -1,
        favorites: favorited_users ? favorited_users.length : 0
    }    
}

export const createTweet = async (tweet: AddTweetRequestBody) => {
    const { data, error } = await supabaseClient
        .from<Tweet>(TWEETS_TABLE)
        .insert(tweet)
   
    if(error) {
        throw new Error(error.message)
    }

    return data || []
}