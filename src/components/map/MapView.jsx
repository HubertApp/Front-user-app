import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function MapErrorMessage({ onRetry }) {
  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-4 px-6 z-10">
      <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center">
        <i className="fa-solid fa-map text-2xl text-teal" />
      </div>
      <div className="text-center">
        <p className="text-[#0f172a] text-sm font-semibold mb-1">
          Un problème est survenu avec la carte
        </p>
        <p className="text-[#64748b] text-xs leading-relaxed max-w-[260px]">
          La carte n'a pas pu se charger. Vérifiez votre connexion ou renseignez un token Mapbox valide.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 bg-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-hover transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}

export default function MapView({
  center = [6.1727, 49.1193],
  zoom = 13,
  style = 'mapbox://styles/mapbox/streets-v12',
  className = 'absolute inset-0',
}) {
  const containerRef = useRef(null);
  const [error, setError]       = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) { setError(true); return; }

    let map;
    let cancelled = false;
    const ctrl = new AbortController();

    const showError = () => { if (!cancelled) setError(true); };

    const styleApiUrl = style.startsWith('mapbox://styles/')
      ? `https://api.mapbox.com/styles/v1/${style.slice('mapbox://styles/'.length)}?access_token=${token}`
      : null;

    const initMap = () => {
      mapboxgl.accessToken = token;
      const timer = setTimeout(showError, 12_000);

      try {
        map = new mapboxgl.Map({
          container,
          style,
          center,
          zoom,
          dragRotate: false,
          pitchWithRotate: false,
          attributionControl: false,
        });

        map.once('load', () => { if (!cancelled) clearTimeout(timer); });
        map.on('error', () => { clearTimeout(timer); showError(); });
      } catch {
        clearTimeout(timer);
        showError();
      }
    };

    if (styleApiUrl) {
      fetch(styleApiUrl, { method: 'HEAD', signal: ctrl.signal })
        .then(res => {
          if (cancelled) return;
          if (!res.ok && res.status !== 405) { showError(); return; }
          initMap();
        })
        .catch(err => {
          if (err.name !== 'AbortError' && !cancelled) initMap();
        });
    } else {
      initMap();
    }

    return () => {
      cancelled = true;
      ctrl.abort();
      map?.remove();
    };
  }, [retryKey]);

  const handleRetry = () => {
    setError(false);
    setRetryKey(k => k + 1);
  };

  return (
    <div
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
      />
      {error && <MapErrorMessage onRetry={handleRetry} />}
    </div>
  );
}
