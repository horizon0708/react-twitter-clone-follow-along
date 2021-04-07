import React, { useEffect, useState } from "react";

export type useLoaderOption = {
    fetchOnLoad: boolean
}

export function useLoader<T>(promise: Promise<T>, { fetchOnLoad }: useLoaderOption = { fetchOnLoad: true }): [boolean, T | undefined, ()=>Promise<void>] {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<T | undefined>(undefined);

  const runPromise = async () => {
    setIsLoading(true);
    try {
      const res = await promise;
      setResult(res);
    } catch (err) {
      setResult(err)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=> {
      if(fetchOnLoad) {
        runPromise()
      }
  },[])

  return [isLoading, result, runPromise];
}
