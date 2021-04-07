import { AuthSession } from '@supabase/supabase-js'
import React from 'react'
import { Redirect } from 'react-router'
import { supabaseClient } from '../api/supabaseClient'

export type WithAuthProps = {
    session: AuthSession
}

export function WithAuth<P extends WithAuthProps>(
    Component: React.ComponentType<P>,
    redirectTo: string = "/signin"): React.FC<Omit<P,"session">> {
    return function WithAuthWrapper({...props}) {
        const session = supabaseClient.auth.session()
        if(!session) {
            return <Redirect to={`${redirectTo}?redirectUri=${window.location.pathname}`}/>
        }
        return <Component {...props as P} session={session}/>
    }
}

export function WithoutAuth<P extends object>(
    Component: React.ComponentType<P>,
    redirectTo: string = "/"): React.FC<P> {
    return function WithoutAuthWrapper({ ...props}) {
        const session = supabaseClient.auth.session()
        if(session) {
            return <Redirect to={redirectTo}/>
        }
        return <Component {...props} />
    }
}