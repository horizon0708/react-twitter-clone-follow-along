import { AuthSession } from "@supabase/supabase-js";
import React, { useContext, useEffect, useState } from "react";
import { supabaseClient } from "../api/supabaseClient";

export type AuthContext = {
    session: AuthSession | null
}

const AuthContext = React.createContext<AuthContext>({ session: null});

export const AuthProvider:React.FC<{}> = ({ children }) => {
    const [session, setSession] = useState<AuthSession | null>(supabaseClient.auth.session())
    useEffect(()=> {
        const cleanup = supabaseClient.auth.onAuthStateChange((_ev, session)=> {
            console.log("auth session changed", session)
            setSession(session)
        })

        return () => {
            console.log("clearing up auth subscription")
            cleanup.data?.unsubscribe()
        }
    },[])

    return <AuthContext.Provider value={{session}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const auth = useContext(AuthContext)
    return auth
}