import { useCallback, useEffect, useState } from 'react';
import { fetchDisruptions } from '../api/disruptions';

export function useDisruptions({ lat, lon, radiusM = 3000 }) {
  const [disruptions, setDisruptions] = useState([]);

  const [covered, setCovered] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => setReloadKey(k => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchDisruptions({ lat, lon, radiusM, signal: controller.signal })
      .then(result => {
        setDisruptions(result.disruptions);
        setCovered(result.covered);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setDisruptions([]);
        setLoading(false);
      });

    return () => controller.abort();
  }, [lat, lon, radiusM, reloadKey]);

  return { disruptions, loading, error, refetch, covered };
}

const SEVERITY_BY_NIVEAU = {
  Congestionne: 'severe',
  Ralenti: 'medium',
  Fluide: 'minor',
};

const RISK_BY_NIVEAU = {
  Congestionne: 'Risque de congestion',
  Ralenti: 'Risque de ralentissement',
  Fluide: 'Circulation fluide',
};


function formatDistance(meters) {
  if (meters < 300) return 'autour de vous';
  return meters < 1000
    ? `à ${Math.round(meters)} m`
    : `à ${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}
export function toAlertCard(d) {
  const extraMinutes = Math.max(0, Math.round((d.friction - 1) * 10));
  return {
    id: d.tileId,
    severity: SEVERITY_BY_NIVEAU[d.niveau] ?? 'medium',
    type: 'road',
    title: `${RISK_BY_NIVEAU[d.niveau] ?? d.niveau} ${formatDistance(d.distanceM)}`,
    delay: extraMinutes > 0 ? `+${String(extraMinutes).padStart(2, '0')} min / 10 min` : null,
    ts: 'prévision',
  };
}
