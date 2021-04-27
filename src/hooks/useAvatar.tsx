import React, { useEffect, useState } from 'react'
import { supabaseClient } from '../api/supabaseClient'
import { AVATAR_BUCKET } from '../constants'


export const useAvatar = (uri?: string | null): [string | null, boolean] => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [avatar, setAvatar] = useState<string | null>(null)

    const load = async (uri?: string | null) => {
        if(!uri) {
            setAvatar(null)
            return 
        }

        setIsLoading(true)
        const { data, error } = await supabaseClient.storage
            .from(AVATAR_BUCKET)
            .download(uri)
       
        if(error) {
            console.error(`failed to load ${uri}`, error)
            setAvatar(null)
            return
        }
        if(!data) {
            setAvatar(null)
            return 
        }
        setAvatar(URL.createObjectURL(data))
        setIsLoading(false)
    }

    useEffect(()=> {
        load(uri)
    }, [uri])  

    return [avatar, isLoading]
}