import React, { useState, useEffect } from 'react'
import { definitions } from '../api/types';
import { supabaseClient } from '../api/supabaseClient';
import { PROFILES_TABLE } from '../constants';

export type Profile = definitions["profiles"]
type ProfileResult = [Profile| null, {message: string} | null, boolean]

export const useProfile = (query: "id" | "username", id?: string): ProfileResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<Profile | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);

  const runPromise = async (id: string) => {
    setIsLoading(true);
    const { data, error } = 
        await supabaseClient.from<Profile>(PROFILES_TABLE)
            .select("*")
            .eq(query, id)
    if(error) {
      setError(error)
    }

    if(data && data.length) {
      setResult(data[0])
    }
    setIsLoading(false)
  };

  useEffect(()=> {
    if(id) {
        runPromise(id)
    }
  }, [id])

  return [result, error, isLoading]
}
