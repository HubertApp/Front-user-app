import { useMemo, useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import AlertCard from '../components/traffic/AlertCard';
import StopCard from '../components/traffic/StopCard';
import MapView from '../components/map/MapView';
import { trafficAlerts } from '../data/mock';
import { useTheme } from '../context/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { useNearbyStops } from '../hooks/useNearbyStops';

// Metz : le jeu de données GTFS de référence est lorrain.
const METZ_CENTER = [6.1757, 49.1193];
const RADIUS_STEPS = [300, 500, 1000];

function formatRadius(meters) {
  return meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}

export default function TrafficPage() {
  const [tab, setTab] = useState('trajets');
  const [radius, setRadius] = useState(500);
  const [center, setCenter] = useState(METZ_CENTER);
  const [locating, setLocating] = useState(false);
  const [located, setLocated] = useState(false);
  const { collapsed } = useTheme();
  usePageMeta({ title: 'Infos trafic', description: 'Consultez les perturbations en temps réel sur vos trajets et autour de votre position.', path: '/trafic' });

  const { stops, loading, error, refetch } = useNearbyStops({
    lat: center[1],
    lon: center[0],
    radiusMeters: radius,
    // En hypercentre il y a déjà ~21 arrêts à 300 m : sous ce plafond, tous les
    // rayons renverraient le même nombre de résultats et le réglage semblerait
    // sans effet.
    first: 50,
  });

  const markers = useMemo(
    () => stops
      .filter(stop => stop.location)
      .map(stop => ({
        id: stop.id,
        longitude: stop.location.longitude,
        latitude: stop.location.latitude,
        label: stop.name,
      })),
    [stops],
  );

  const cycleRadius = () =>
    setRadius(current => RADIUS_STEPS[(RADIUS_STEPS.indexOf(current) + 1) % RADIUS_STEPS.length]);

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        setCenter([position.coords.longitude, position.coords.latitude]);
        setLocated(true);
        setLocating(false);
      },
      // Hors de la zone couverte par le GTFS chargé, la vraie position ne
      // renverrait aucun arrêt : on retombe sur Metz plutôt que d'afficher
      // une liste vide qui donnerait l'impression d'un bug.
      () => {
        setCenter(METZ_CENTER);
        setLocated(false);
        setLocating(false);
      },
      { timeout: 8000 },
    );
  };

  return (
    <div className={`min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <main id="main-content" className="max-w-2xl mx-auto px-5 md:px-8">
        <PageHeader
          eyebrow="Aujourd'hui · 08:14"
          title="Infos trafic"
          action={
            <button
              onClick={refetch}
              className="pressable w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center"
              aria-label="Recharger"
            >
              <i className="fa-solid fa-rotate text-[13px]" />
            </button>
          }
        />

        {/* Segmented tabs */}
        <div className="flex bg-white border border-line rounded-2xl p-1 gap-1 mb-4">
          <button
            onClick={() => setTab('trajets')}
            className={`flex-1 h-10 rounded-xl text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all ${
              tab === 'trajets'
                ? 'bg-ink text-white shadow-md'
                : 'text-muted hover:text-ink'
            }`}
          >
            <i className="fa-solid fa-route text-[11px]" />
            Mes trajets
          </button>
          <button
            onClick={() => setTab('position')}
            className={`flex-1 h-10 rounded-xl text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all ${
              tab === 'position'
                ? 'bg-ink text-white shadow-md'
                : 'text-muted hover:text-ink'
            }`}
          >
            <i className="fa-solid fa-location-dot text-[11px]" />
            Ma position
          </button>
        </div>

        {tab === 'trajets' ? (
          <>
            {/* Summary banner */}
            <div className="flex items-center gap-3 p-3.5 bg-white border border-line rounded-2xl mb-3">
              <span className="w-9 h-9 rounded-xl bg-warning-soft text-warning inline-flex items-center justify-center text-[13px]">
                <i className="fa-solid fa-triangle-exclamation" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-ink">
                  3 perturbations sur vos trajets
                </p>
                <p className="text-[11px] text-muted mt-0.5">
                  Délai cumulé estimé : <b className="text-ink">+32 min</b>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {trafficAlerts.map(a => (
                <AlertCard key={a.id} {...a} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="relative h-56 rounded-2xl overflow-hidden border border-line mb-3">
              <MapView withRoute={false} withPin center={center} zoom={15} markers={markers} />
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-white border border-line rounded-2xl mb-3">
              <button
                onClick={locate}
                disabled={locating}
                aria-label="Utiliser ma position"
                className="pressable w-10 h-10 rounded-xl bg-teal-soft text-teal-hover inline-flex items-center justify-center text-base shrink-0"
              >
                <i className={`fa-solid ${locating ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'}`} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-bold text-ink">
                  {located ? 'Autour de moi' : 'Centre-ville de Metz'}
                </p>
                <p className="text-[11.5px] text-muted mt-0.5">
                  Rayon d'analyse : {formatRadius(radius)}
                </p>
              </div>
              <button
                onClick={cycleRadius}
                aria-label="Changer le rayon"
                className="pressable w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center text-[12px]"
              >
                <i className="fa-solid fa-sliders" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {error && (
                <div className="flex items-center gap-3 p-3.5 bg-white border border-line rounded-2xl">
                  <span className="w-9 h-9 rounded-xl bg-danger-soft text-danger inline-flex items-center justify-center text-[13px] shrink-0">
                    <i className="fa-solid fa-triangle-exclamation" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-ink">Arrêts indisponibles</p>
                    <p className="text-[11px] text-muted mt-0.5">{error}</p>
                  </div>
                  <button
                    onClick={refetch}
                    className="text-[12px] font-semibold text-teal-hover hover:underline shrink-0"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {!error && loading && (
                <p className="text-[12.5px] text-muted px-1 py-2">Recherche des arrêts…</p>
              )}

              {!error && !loading && stops.length === 0 && (
                <p className="text-[12.5px] text-muted px-1 py-2">
                  Aucun arrêt dans un rayon de {formatRadius(radius)}.
                </p>
              )}

              {!error && !loading && stops.map(stop => (
                <StopCard key={stop.id} {...stop} />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
