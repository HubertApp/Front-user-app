import { useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import BackBar from '../components/layout/BackBar';
import BottomNav from '../components/layout/BottomNav';
import MapView from '../components/map/MapView';
import RouteBadge from '../components/traffic/RouteBadge';
import { useTheme } from '../context/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { useStop } from '../hooks/useStop';
import { formatGtfsTime } from '../utils/gtfsTime';

const DEPARTURES_SHOWN = 10;

function DepartureRow({ departure }) {
  const time = formatGtfsTime(departure.departureTime);

  return (
    <li className="flex items-center gap-3 px-3.5 py-3">
      <span className="flex flex-col items-center w-14 shrink-0">
        <span className="font-mono text-[15px] font-bold text-ink tabular-nums">
          {time ? time.label : '--:--'}
        </span>
        {time?.nextDay && (
          <span className="text-[10px] text-soft font-mono uppercase">demain</span>
        )}
      </span>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        {departure.route && <RouteBadge route={departure.route} />}
        <span className="text-[13px] font-semibold text-ink truncate">
          {departure.headsign || 'Destination inconnue'}
        </span>
      </div>
    </li>
  );
}

export default function StopPage() {
  const { id } = useParams();
  const { collapsed } = useTheme();
  const { stop, loading, error, refetch } = useStop(id, { first: DEPARTURES_SHOWN });

  usePageMeta({
    title: stop?.name || 'Arrêt',
    description: stop
      ? `Prochains passages à l'arrêt ${stop.name}.`
      : 'Prochains passages à cet arrêt.',
    path: `/arret/${id}`,
    noIndex: true,
  });

  const location = stop?.location;

  return (
    <div className={`min-h-screen bg-warm-bg text-ink pb-28 md:pb-12 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <main id="main-content" className="max-w-2xl mx-auto px-5 md:px-8">
        {/* Sans `to` : on revient d'où l'on vient, la fiche s'ouvrant
            aussi bien depuis la proximité que depuis la recherche. */}
        <BackBar />

        <PageHeader
          eyebrow={stop?.network?.cityOrRegion || 'Arrêt'}
          title={stop?.name || (loading ? 'Chargement…' : 'Arrêt')}
          action={
            stop && (
              <button
                onClick={refetch}
                className="pressable w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center"
                aria-label="Recharger"
              >
                <i className="fa-solid fa-rotate text-[13px]" />
              </button>
            )
          }
        />

        {error && (
          <div className="flex items-center gap-3 p-3.5 bg-white border border-line rounded-2xl">
            <span className="w-9 h-9 rounded-xl bg-danger-soft text-danger inline-flex items-center justify-center text-[13px] shrink-0">
              <i className="fa-solid fa-triangle-exclamation" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-ink">Fiche indisponible</p>
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
          <p className="text-[12.5px] text-muted px-1 py-2">Chargement de l'arrêt…</p>
        )}

        {/* Un identifiant inconnu n'est pas une panne : pas de « Réessayer »,
            qui ne mènerait nulle part. */}
        {!error && !loading && !stop && (
          <div className="p-3.5 bg-white border border-line rounded-2xl">
            <p className="text-[12.5px] font-semibold text-ink">Arrêt introuvable</p>
            <p className="text-[11px] text-muted mt-0.5">
              Cet arrêt n'existe pas ou n'est plus desservi.
            </p>
          </div>
        )}

        {!error && !loading && stop && (
          <>
            {stop.routes?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {stop.routes.map(route => (
                  <RouteBadge key={route.id} route={route} />
                ))}
              </div>
            )}

            {location && (
              <div className="relative h-56 rounded-2xl overflow-hidden border border-line mb-3">
                <MapView
                  withRoute={false}
                  withPin={false}
                  center={[location.longitude, location.latitude]}
                  zoom={16}
                  markers={[{
                    id: stop.id,
                    longitude: location.longitude,
                    latitude: location.latitude,
                    label: stop.name,
                  }]}
                />
              </div>
            )}

            <div className="bg-white border border-line rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-3.5 pt-3.5 pb-2">
                <p className="text-[13.5px] font-bold text-ink">Prochains passages</p>
                {/* Le GTFS agrégé est statique : annoncer du temps réel serait
                    un mensonge, et l'écart se verrait au quai. */}
                <span className="text-[10px] text-soft font-mono uppercase">
                  Horaires théoriques
                </span>
              </div>

              {stop.departures?.length > 0 ? (
                <ul className="divide-y divide-line">
                  {stop.departures.map(departure => (
                    <DepartureRow key={departure.tripId} departure={departure} />
                  ))}
                </ul>
              ) : (
                <p className="text-[12.5px] text-muted px-3.5 pb-3.5">
                  Plus aucun passage prévu aujourd'hui.
                </p>
              )}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
