import React from 'react'
import { Avatar } from '@material-ui/core';
import { useQuery } from 'react-query';
import { fetchAvatar, fetchAvatarPresignedUrl } from '../api/avatars';


export type UserAvatarProps = {
    path?: string
    name?: string
    className?: string
}

export const UserAvartar:React.FC<UserAvatarProps> = ({ name, path, className }) => {
    const { data } = useQuery(
        ['avatar', path], 
        fetchAvatar,  
        { 
            enabled: !!path,
            // staleTime: 1000 * 60 * 60, // 1 hour
        }
    )

    // const { data } = useQuery(
    //     ['avatar', path],
    //     fetchAvatarPresignedUrl,
    //     {
    //         enabled: !!path,
    //         staleTime: 1000 * 60 * 60, // 1 hour
    //     }
    // )

    return <Avatar className={className} alt={name} src={data} />
}