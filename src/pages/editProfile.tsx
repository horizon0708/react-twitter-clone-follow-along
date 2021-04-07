import { AuthSession } from '@supabase/supabase-js'
import React from 'react'
import { WithAuth } from '../hocs/withAuth'


const EditProfilePage : React.FC<{ session: AuthSession }> = ({session })=> {
    return <div>
        {session.user.email}
    </div>
}

export default WithAuth(EditProfilePage)