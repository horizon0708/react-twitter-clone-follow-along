import { QueryFunction } from "react-query"
import { AVATAR_BUCKET } from "../constants"
import { supabaseClient } from "./supabaseClient"

export const fetchAvatar: QueryFunction<string | undefined> = async ({ queryKey }) => {
    const [_key, path] = queryKey
    const { data, error } = await supabaseClient.storage
        .from(AVATAR_BUCKET)
        .download(path as string)
    
    if(error) {
        throw new Error(error.message)
    }

    if(!data) {
        return undefined
    }

    return URL.createObjectURL(data)
}

export const fetchAvatarPresignedUrl: QueryFunction<string | undefined> = async({ queryKey }) => {
    const [_key, path] = queryKey
    const { data, error } = await supabaseClient.storage
        .from(AVATAR_BUCKET)
        .createSignedUrl(path as string, 3600)
    
    if(error) {
        throw new Error(error.message)
    }

    if(!data) {
        return undefined
    }

    return data.signedURL 
}