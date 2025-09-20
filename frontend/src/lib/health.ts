import { useState, useEffect } from 'react';

export function useHealthStatus(pollIntervalMs: number = 30000) {
  const [ok, setOk] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // status check
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
        //testlog
        console.log(res.ok)

        if(res && res.ok){
            setOk(true)
        }
      } catch {
        //test log
        console.log('catch, not try')

        setOk(false);
      }
    };

    //init check
    checkStatus();
    //poll on interval
    const id = setInterval(checkStatus, pollIntervalMs);
    return () => clearInterval(id);
  }, [pollIntervalMs]);

  return ok;
}