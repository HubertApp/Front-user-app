import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getCurrentPosition } from '../../services/geolocation';

const DEFAULT_CENTER = [6.1727, 49.1193];
const DEFAULT_STYLE = 'mapbox://styles/mapbox/streets-v12';

// Identité stable : évite de relancer l'effet des marqueurs à chaque rendu des
// pages qui n'en passent pas.
const EMPTY_MARKERS = [];

const ROUTE_SOURCE = 'itinerary';
const EMPTY_FC = { type: 'FeatureCollection', features: [] };

const MapPlaceholder = memo(function MapPlaceholder({ withRoute = true, withPin = true }) {
  return (
    <div className="absolute inset-0 overflow-hidden map-placeholder">
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6">
            <path d="M0,6 L6,0" stroke="#D6E0CB" strokeWidth="0.6" />
          </pattern>
          <linearGradient id="riverG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#BFD4E0" />
            <stop offset="100%" stopColor="#A8C2D2" />
          </linearGradient>
        </defs>

        <rect width="400" height="800" fill="#E6EDDE" />
        <path d="M40 120 Q90 90 140 130 Q170 180 130 220 Q70 240 40 200 Z" fill="#C9DCB7" />
        <path d="M260 460 Q310 440 350 480 Q360 540 320 570 Q260 580 240 530 Z" fill="#C9DCB7" />
        <rect width="400" height="800" fill="url(#hatch)" opacity="0.5" />

        <path
          d="M-20 320 C 80 280, 150 380, 200 360 S 320 280, 420 340 L 420 400 C 320 360, 250 460, 200 440 S 80 360, -20 380 Z"
          fill="url(#riverG)"
          opacity="0.85"
        />

        {[80, 160, 240, 300, 420, 520, 580, 660, 740].map((y, i) => (
          <line key={'h' + i} x1="-20" y1={y} x2="420" y2={y} stroke="#FAFAF4" strokeWidth={i % 3 === 0 ? 6 : 3} />
        ))}
        {[40, 110, 175, 245, 310, 360].map((x, i) => (
          <line key={'v' + i} x1={x} y1="-20" x2={x} y2="820" stroke="#FAFAF4" strokeWidth={i % 2 === 0 ? 5 : 3} />
        ))}
        <line x1="-20" y1="-20" x2="430" y2="500" stroke="#FAFAF4" strokeWidth="4" />

        {[
          [60, 100, 38, 50], [180, 270, 50, 60], [270, 350, 38, 70],
          [80, 540, 56, 48], [250, 600, 38, 60], [120, 660, 48, 60],
          [305, 100, 45, 38], [55, 380, 40, 38], [320, 220, 30, 50],
        ].map((b, i) => (
          <rect key={'b' + i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} fill="#E2E8DA" stroke="#D5DDC9" strokeWidth="0.8" rx="2" />
        ))}

        {withRoute && (
          <>
            <path d="M 80 660 C 140 620, 150 540, 220 500 S 280 360, 340 220"
                  fill="none" stroke="#0E1A24" strokeWidth="5" strokeLinecap="round" />
            <path d="M 80 660 C 140 620, 150 540, 220 500 S 280 360, 340 220"
                  fill="none" stroke="var(--color-teal)" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </svg>

      {withPin && (
        <>
          <span
            className="absolute bg-teal text-white rounded-full flex items-center justify-center"
            style={{
              bottom: '22%', left: '18%', width: 28, height: 28,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              boxShadow: '0 4px 10px rgba(15,26,36,0.25)',
            }}
          >
            <i className="fa-solid fa-circle text-[10px]" style={{ transform: 'rotate(45deg)' }} />
          </span>
          <span
            className="absolute bg-ink text-white rounded-full flex items-center justify-center"
            style={{
              top: '24%', right: '14%', width: 28, height: 28,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              boxShadow: '0 4px 10px rgba(15,26,36,0.25)',
            }}
          >
            <i className="fa-solid fa-flag-checkered text-[10px]" style={{ transform: 'rotate(45deg)' }} />
          </span>
        </>
      )}

      <div
        className="absolute flex items-center gap-1.5 bg-white rounded-full font-semibold text-ink"
        style={{ top: '24%', left: '14%', fontSize: 11, padding: '6px 10px', boxShadow: '0 2px 8px rgba(15,26,36,0.10)' }}
      >
        <i className="fa-solid fa-location-crosshairs text-teal text-[10px]" />
        Ma position
      </div>
    </div>
  );
});

const MapView = forwardRef(function MapView({
  center = DEFAULT_CENTER,
  zoom = 13,
  style = DEFAULT_STYLE,
  className = 'absolute inset-0',
  withRoute = true,
  withPin = true,
  markers = EMPTY_MARKERS,
  route = null, // FeatureCollection renvoyée par getItineraireFromTo
  onReady,
}, ref) {
  const containerRef = useRef(null);
  const markersRef = useRef([]);
  const [error, setError] = useState(false);
  // Exposé en state, et non en ref, pour que les effets ci-dessous se relancent
  // dès que la carte existe. Volontairement posé à la construction et non sur
  // l'événement `load` : dans un onglet d'arrière-plan, rAF est suspendu et
  // `load` ne part jamais — les marqueurs, simples overlays DOM, n'en ont pas
  // besoin.
  const [map, setMap] = useState(null);

  // Lus une seule fois à l'initialisation, sans devenir des dépendances d'effet.
  const centerRef = useRef(center);
  const zoomRef = useRef(zoom);
  const onReadyRef = useRef(onReady);
  centerRef.current = center;
  zoomRef.current = zoom;
  onReadyRef.current = onReady;

  // Initialisation. Volontairement indépendante de `center`/`zoom` : les inclure
  // ici détruirait et reconstruirait tout le canvas WebGL à chaque recentrage.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) { setError(true); return; }

    let cancelled = false;
    let timer;
    let instance;

    // Le watchdog ne vaut que si la page est visible : en arrière-plan Mapbox
    // ne compose aucune frame, `load` n'arrive pas, et on afficherait à tort
    // le placeholder d'erreur sur une carte parfaitement saine.
    const armWatchdog = () => {
      if (document.hidden || timer) return;
      timer = setTimeout(() => !cancelled && setError(true), 12_000);
    };
    const onVisibility = () => armWatchdog();

    try {
      mapboxgl.accessToken = token;
      armWatchdog();
      document.addEventListener('visibilitychange', onVisibility);

      instance = new mapboxgl.Map({
        container,
        style,
        center: centerRef.current,
        zoom: zoomRef.current,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: false,
      });

      instance.once('load', () => {
        clearTimeout(timer);
        if (cancelled) return;
        setError(false);
        onReadyRef.current?.(instance);
      });
      instance.on('error', () => { clearTimeout(timer); setError(true); });

      setMap(instance);
    } catch {
      setError(true);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      setMap(null);
      instance?.remove();
    };
  }, [style]);

  // Recentrage : on anime la caméra plutôt que de reconstruire la carte.
  useEffect(() => {
    if (!map) return;
    map.flyTo({ center, zoom, essential: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, center[0], center[1], zoom]);

  // Marqueurs. Pour quelques dizaines de points, `Marker` reste plus simple
  // qu'un couple addSource/addLayer, et donne un onClick par marqueur.
  useEffect(() => {
    if (!map) return;

    markersRef.current = markers
      .filter(m => Number.isFinite(m.longitude) && Number.isFinite(m.latitude))
      .map(m => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'map-stop-marker';
        el.setAttribute('aria-label', m.label || 'Arrêt');
        if (m.label) el.title = m.label;
        if (m.onClick) el.addEventListener('click', m.onClick);
        return new mapboxgl.Marker({ element: el })
          .setLngLat([m.longitude, m.latitude])
          .addTo(map);
      });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, markers]);

  // Tracé de l'itinéraire : une source GeoJSON, trois couches filtrées sur
  // properties.kind. addSource/addLayer exigent un style chargé — or `map`
  // est posé à la construction, avant l'événement `load` (voir plus haut).
  useEffect(() => {
    if (!map) return undefined;

    const draw = () => {
      const data = route ?? EMPTY_FC;
      const source = map.getSource(ROUTE_SOURCE);

      if (source) {
        // Mise à jour : les couches restent en place et suivent la source.
        source.setData(data);
      } else {
        map.addSource(ROUTE_SOURCE, { type: 'geojson', data });

        // Mapbox dessine dans l'ordre d'ajout : le trait, les étapes, puis
        // le départ et l'arrivée par-dessus.
        map.addLayer({
          id: 'itinerary-line',
          type: 'line',
          source: ROUTE_SOURCE,
          filter: ['==', ['get', 'kind'], 'route'],
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#2563eb', 'line-width': 5 },
        });

        map.addLayer({
          id: 'itinerary-steps',
          type: 'circle',
          source: ROUTE_SOURCE,
          filter: ['==', ['get', 'kind'], 'step'],
          paint: {
            'circle-radius': 4,
            'circle-color': '#ffffff',
            'circle-stroke-color': '#2563eb',
            'circle-stroke-width': 2,
          },
        });

        map.addLayer({
          id: 'itinerary-ends',
          type: 'circle',
          source: ROUTE_SOURCE,
          filter: ['in', ['get', 'kind'], ['literal', ['start', 'end']]],
          paint: {
            'circle-radius': 7,
            'circle-color': ['match', ['get', 'kind'], 'start', '#16a34a', '#dc2626'],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
          },
        });
      }

      // Cadrage sur le trajet entier, grâce à la bbox calculée côté back.
      if (route?.bbox) {
        const [minLon, minLat, maxLon, maxLat] = route.bbox;
        map.fitBounds([[minLon, minLat], [maxLon, maxLat]], { padding: 60, duration: 800 });
      }
    };

    if (map.isStyleLoaded()) {
      draw();
      return undefined;
    }
    // `load` ne part qu'une fois : s'il est déjà passé, on attendrait
    // indéfiniment. `idle` se déclenche chaque fois que la carte a fini de rendre.
    map.once('idle', draw);
    return () => map.off('idle', draw);
  }, [map, route]);

  // Expose des commandes de haut niveau (zoom, géolocalisation) plutôt que
  // l'instance mapboxgl brute : les pages appelantes n'ont pas à connaître
  // l'API mapbox-gl, et les appels restent no-op tant que la carte n'est pas
  // prête (`map` state encore null).
  useImperativeHandle(ref, () => ({
    zoomIn: () => map?.zoomIn(),
    zoomOut: () => map?.zoomOut(),
    // Même service que le reste de l'app : invite native sur Android/iOS
    // (Capacitor), invite du navigateur sur le web.
    locate: (onError) => {
      if (!map) return;
      getCurrentPosition()
        .then(pos => map.flyTo({ center: [pos.lon, pos.lat], zoom: 15, essential: true }))
        .catch(err => onError?.(err?.code ?? 'unavailable'));
    },
  }), [map]);

  return (
    <div className={className} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      {error && <MapPlaceholder withRoute={withRoute} withPin={withPin} />}
    </div>
  );
});

export default MapView;
