import { useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentPosition } from '../services/geolocation';


export function useUserPosition({ fallback, auto = true }) {
  const [position, setPosition] = useState(fallback);
  const [status, setStatus] = useState(auto ? 'locating' : 'idle');
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const dejaLocalise = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const locate = useCallback(async () => {
    setStatus('locating');
    setError(null);
    try {
      const pos = await getCurrentPosition();
      if (!mounted.current) return;
      dejaLocalise.current = true;
      setPosition({ lat: pos.lat, lon: pos.lon });
      setStatus('located');
    } catch (err) {
      if (!mounted.current) return;
      setError(err?.code ?? 'unavailable');
      setStatus(dejaLocalise.current ? 'located' : 'fallback');
    }
  }, []);

  useEffect(() => {
    if (auto) locate();
  }, []);

  return { position, status, error, locate };
}
