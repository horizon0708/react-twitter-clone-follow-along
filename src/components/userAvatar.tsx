import React from 'react'
import { AuthSession } from '@supabase/supabase-js';
import { Avatar } from '@material-ui/core';


export type UserAvatarProps = {
    avatarUrl?: string | null
    name?: string
    className?: string
}

export const UserAvartar:React.FC<UserAvatarProps> = ({ name, avatarUrl, className }) => {
    return <Avatar className={className} alt={name} src={avatarUrl ?? undefined} />
}