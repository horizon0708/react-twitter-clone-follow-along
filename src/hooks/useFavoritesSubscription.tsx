import React, { useEffect, useState } from 'react'
import { getFavoriteByIds } from '../api/favorites'
import { supabaseClient } from '../api/supabaseClient'
import { FAVORITES_TABLE } from '../constants'
import { useAuth } from '../contexts/authContext'


export const useFavoriteSubscription = () => {
    const { user } = useAuth()
    const [newFavorites, setNewFavorites] = useState<number[]>([]);

    const clearNewFavorites = () => {
        console.log("clearing")
        setNewFavorites([])
    }

    const wtf = (id: number) => {
        setNewFavorites([id, ...newFavorites])
    }

    useEffect(()=> {
        const { unsubscribe } = supabaseClient
            .from(FAVORITES_TABLE)
            .on("INSERT", payload => {
                if(payload.new.user_id !== user?.id) {
                    setNewFavorites([...newFavorites, payload.new.id])
                }
            })
            .subscribe()
        return () => {
            try {
                unsubscribe()
            } catch (e) {
                console.error(e)
            }
        }
    }, [newFavorites, setNewFavorites])

    return {
        newFavorites,
        clearNewFavorites
    }
}
//73
//ec289e51-56a2-4f77-a0de-3340d12a5f96