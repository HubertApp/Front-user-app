import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/map/MapView';
import AutocompleteItem from '../components/search/AutocompleteItem';
import ItineraryStep from '../components/itinerary/ItineraryStep';
import EndpointDot from '../components/ui/EndpointDot';
import { autocompleteResults, savedPlaces, itinerarySteps } from '../data/mock';

/* ──────────────────────────────────────────────────────────────────────────
   Step 1 — Destination search (autocomplete + saved places + recents)
   ────────────────────────────────────────────────────────────────────────── */
function DestinationStep({ query, onChange, onSelect, onSelectSaved }) {
  const showAuto = query.length > 0;
  const filtered = autocompleteResults.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-2 pb-3">
        <div
          className="h-14 bg-white rounded-2xl flex items-center pl-4 pr-2 gap-3"
          style={{ boxShadow: '0 1px 2px rgba(15,26,36,0.04), 0 12px 30px -16px rgba(15,26,36,0.16)' }}
        >
          <i className="fa-solid fa-magnifying-glass text-soft" />
          <input
            autoFocus
            value={query}
            onChange={e => onChange(e.target.value)}
            placeholder="Un pays, une destination..."
            className="flex-1 bg-transparent border-none outline-none text-[14.5px] font-medium text-ink min-w-0 placeholder:text-soft"
          />
          <button className="w-10 h-10 rounded-xl bg-ink text-white flex items-center justify-center" aria-label="Map">
            <i className="fa-solid fa-map-location-dot text-sm" />
          </button>
        </div>
      </div>

      {!showAuto ? (
        <>
          <p className="px-5 pb-2 h-section">Lieux enregistrés</p>
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {savedPlaces.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectSaved(p)}
                className="pressable inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-line rounded-xl text-[13px] font-semibold text-ink"
              >
                <i className={`fa-solid ${p.icon} text-teal-hover text-[12px]`} />
                {p.label}
              </button>
            ))}
          </div>

          <p className="px-5 pt-3 pb-2 h-section">Récents</p>
          <div className="flex-1 overflow-y-auto pb-6">
            {[
              { name: 'Metz Centre', sub: 'Recherché hier',           icon: 'fa-clock-rotate-left' },
              { name: 'Strasbourg',  sub: '10/04/2024 · voyage',      icon: 'fa-clock-rotate-left' },
              { name: 'Paris CDG',   sub: '02/06/2024 · voyage',      icon: 'fa-clock-rotate-left' },
            ].map((r, i) => (
              <AutocompleteItem
                key={i}
                name={r.name}
                sub={r.sub}
                icon={r.icon}
                onClick={() => onSelect({ name: r.name })}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <p className="px-5 pt-2 pb-1 h-section">Villes, gares & stations</p>
          {filtered.map(r => (
            <AutocompleteItem key={r.id} {...r} onClick={() => onSelect(r)} />
          ))}
          {filtered.length === 0 && (
            <p className="px-5 py-8 text-center text-[13px] text-muted">
              Aucun résultat pour « {query} »
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Step 2 — Route builder (drag-to-reorder stops)
   ────────────────────────────────────────────────────────────────────────── */
function RouteStep({ stops, setStops, onConfirm }) {
  const [draggingIdx, setDraggingIdx] = useState(null);
  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, idx: null });

  const updateStop = (id, value) => setStops(prev => prev.map(s => (s.id === id ? { ...s, value } : s)));
  const addStop = () =>
    setStops(prev => {
      const arr = [...prev];
      arr.splice(arr.length - 1, 0, { id: `wp-${Date.now()}`, value: '' });
      return arr;
    });
  const removeStop = id => setStops(prev => prev.filter(s => s.id !== id));
  const swapStops = () =>
    setStops(prev => {
      const arr = [...prev];
      [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
      return arr;
    });

  const startDrag = useCallback((e, idx) => {
    e.preventDefault();
    dragRef.current = { active: true, idx };
    setDraggingIdx(idx);
  }, []);

  const moveDrag = useCallback(
    e => {
      if (!dragRef.current.active) return;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      if (clientY == null) return;
      const c = containerRef.current;
      if (!c) return;
      const rows = [...c.querySelectorAll('[data-stop-row]')];
      let target = rows.length - 1;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i].getBoundingClientRect();
        if (clientY < r.top + r.height * 0.5) { target = i; break; }
      }
      if (target !== dragRef.current.idx) {
        setStops(prev => {
          const a = [...prev];
          const [it] = a.splice(dragRef.current.idx, 1);
          a.splice(target, 0, it);
          dragRef.current.idx = target;
          return a;
        });
        setDraggingIdx(target);
      }
    },
    [setStops],
  );

  const endDrag = useCallback(() => {
    dragRef.current.active = false;
    setDraggingIdx(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('touchend', endDrag);
    return () => {
      window.removeEventListener('mousemove', moveDrag);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', moveDrag);
      window.removeEventListener('touchend', endDrag);
    };
  }, [moveDrag, endDrag]);

  const canConfirm = stops[0]?.value && stops[stops.length - 1]?.value;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div ref={containerRef} className="mx-4 mt-1 mb-4 bg-white rounded-2xl border border-line overflow-hidden">
        {stops.map((stop, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === stops.length - 1;
          return (
            <div
              key={stop.id}
              data-stop-row=""
              className={`flex items-center gap-3 px-3.5 py-3.5 transition-opacity ${
                !isLast ? 'border-b border-line-soft' : ''
              } ${draggingIdx === idx ? 'opacity-40 bg-line-soft' : 'opacity-100'}`}
            >
              <span
                className="text-soft cursor-grab active:cursor-grabbing touch-none select-none px-1"
                onMouseDown={e => startDrag(e, idx)}
                onTouchStart={e => startDrag(e, idx)}
              >
                <i className="fa-solid fa-grip-vertical text-[11px]" />
              </span>
              <EndpointDot kind={isFirst ? 'start' : isLast ? 'end' : 'wp'} />
              <input
                value={stop.value}
                onChange={e => updateStop(stop.id, e.target.value)}
                placeholder={isFirst ? 'Votre position' : isLast ? 'Où aller ?' : 'Étape intermédiaire'}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-ink min-w-0 placeholder:text-soft placeholder:font-normal"
              />
              {isFirst && (
                <button className="text-teal text-base shrink-0" aria-label="Ma position">
                  <i className="fa-solid fa-location-crosshairs" />
                </button>
              )}
              {isLast && (
                <button onClick={swapStops} className="text-teal text-base shrink-0" aria-label="Inverser">
                  <i className="fa-solid fa-arrows-up-down" />
                </button>
              )}
              {!isFirst && !isLast && (
                <button
                  onClick={() => removeStop(stop.id)}
                  className="w-6 h-6 rounded-full bg-line-soft text-muted hover:bg-danger-soft hover:text-danger flex items-center justify-center text-[10px]"
                  aria-label="Supprimer"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-5 pb-3">
        <button onClick={addStop} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-hover">
          <i className="fa-solid fa-plus text-[10px]" />
          Ajouter une étape
        </button>
        <button onClick={swapStops} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-hover">
          <i className="fa-solid fa-shuffle text-[11px]" />
          Inverser
        </button>
      </div>

      <p className="px-5 pt-2 pb-2 h-section">Suggestions</p>
      <div className="px-4 pb-3 flex flex-wrap gap-2">
        {savedPlaces.map(p => (
          <button
            key={p.id}
            onClick={() =>
              setStops(prev => {
                const arr = [...prev];
                const idx = arr.findIndex(s => !s.value);
                const target = idx === -1 ? arr.length - 1 : idx;
                arr[target] = { ...arr[target], value: p.label };
                return arr;
              })
            }
            className="pressable inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-line rounded-xl text-[13px] font-semibold text-ink"
          >
            <i className={`fa-solid ${p.icon} text-teal-hover text-[12px]`} />
            {p.label}
          </button>
        ))}
      </div>

      <p className="px-5 pt-2 pb-2 h-section">Modes de transport</p>
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        {[
          { label: 'Tous',        ic: 'fa-route',           active: true },
          { label: 'Transports',  ic: 'fa-train-tram'    },
          { label: 'Voiture',     ic: 'fa-car-side'      },
          { label: 'Marche',      ic: 'fa-person-walking' },
          { label: 'Vélo',        ic: 'fa-bicycle'       },
        ].map((m, i) => (
          <button
            key={i}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold ${
              m.active ? 'bg-ink text-white border border-ink' : 'bg-white text-ink border border-line'
            }`}
          >
            <i className={`fa-solid ${m.ic} text-[12px]`} />
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <div className="px-4 pb-5">
        <button
          onClick={onConfirm}
          disabled={!canConfirm}
          className="w-full h-13 bg-ink text-white rounded-2xl font-bold text-sm tracking-wide inline-flex items-center justify-center gap-2.5 disabled:opacity-40 transition-colors hover:enabled:bg-ink-2"
          style={{ height: 52 }}
        >
          <i className="fa-solid fa-route" />
          Calculer l'itinéraire
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Step 3 — Itinerary view (map + draggable bottom sheet)
   ────────────────────────────────────────────────────────────────────────── */
const SNAPS = { peek: 140, mid: 380, full: 640 };

function ItineraryView({ stops, onBack, onSwap, onEdit }) {
  const [saved, setSaved] = useState(false);
  const [snap, setSnap] = useState('mid');
  const [panelH, setPanelH] = useState(SNAPS.mid);
  const [animating, setAnimating] = useState(false);
  const drag = useRef({ on: false, startY: 0, startH: 0, moved: false });
  const curH = useRef(SNAPS.mid);

  const snapTo = key => {
    const h = SNAPS[key];
    curH.current = h;
    setSnap(key);
    setAnimating(true);
    setPanelH(h);
  };

  const startDrag = clientY => {
    drag.current = { on: true, startY: clientY, startH: curH.current, moved: false };
  };
  const moveDrag = clientY => {
    if (!drag.current.on) return;
    const delta = drag.current.startY - clientY;
    const newH = Math.max(SNAPS.peek, Math.min(SNAPS.full, drag.current.startH + delta));
    if (Math.abs(delta) > 4) drag.current.moved = true;
    curH.current = newH;
    setAnimating(false);
    setPanelH(newH);
  };
  const endDrag = () => {
    if (!drag.current.on) return;
    drag.current.on = false;
    if (!drag.current.moved) {
      snapTo(snap === 'peek' ? 'mid' : snap === 'mid' ? 'full' : 'peek');
      return;
    }
    // snap to nearest
    const h = curH.current;
    const best = ['peek', 'mid', 'full'].reduce((acc, k) =>
      Math.abs(SNAPS[k] - h) < Math.abs(SNAPS[acc] - h) ? k : acc, 'peek');
    snapTo(best);
  };

  useEffect(() => {
    const onMM = e => moveDrag(e.clientY);
    const onMU = () => endDrag();
    window.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup', onMU);
    return () => {
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('mouseup', onMU);
    };
  }); // eslint-disable-line

  return (
    <div className="relative h-full">
      <MapView className="absolute inset-0 z-0" withRoute withPin />

      <button
        onClick={onBack}
        className="absolute top-14 left-4 z-30 w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center"
        style={{ boxShadow: '0 4px 10px -4px rgba(15,26,36,0.18)' }}
        aria-label="Retour"
      >
        <i className="fa-solid fa-chevron-left text-sm" />
      </button>

      {/* Route summary card */}
      <div
        className="absolute top-14 left-[70px] right-4 z-20 bg-white rounded-2xl p-3.5 flex gap-3.5 items-center"
        style={{ boxShadow: '0 4px 16px -4px rgba(15,26,36,0.16)' }}
      >
        <div className="flex-1 min-w-0">
          {stops.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center gap-2.5 py-1 ${
                i < stops.length - 1 ? 'border-b border-line-soft mb-1 pb-2' : ''
              }`}
            >
              <EndpointDot kind={i === 0 ? 'start' : i === stops.length - 1 ? 'end' : 'wp'} />
              <span className="flex-1 min-w-0 text-[13.5px] font-semibold text-ink truncate">
                {s.value || (i === 0 ? 'Départ' : i === stops.length - 1 ? 'Arrivée' : 'Étape')}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <button onClick={onEdit} className="w-8 h-8 rounded-[10px] border border-line bg-white text-ink flex items-center justify-center text-[12px]" aria-label="Éditer">
            <i className="fa-solid fa-pen" />
          </button>
          <button onClick={onSwap} className="w-8 h-8 rounded-[10px] border border-line bg-white text-ink flex items-center justify-center text-[12px]" aria-label="Inverser">
            <i className="fa-solid fa-arrows-up-down" />
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      <div
        onTransitionEnd={() => setAnimating(false)}
        className="absolute left-0 right-0 bottom-0 z-20 bg-white flex flex-col overflow-hidden"
        style={{
          height: panelH,
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -4px 32px rgba(15,26,36,0.12)',
          transition: animating ? 'height 0.32s cubic-bezier(0.32, 0.72, 0, 1)' : 'none',
        }}
      >
        <div
          className="shrink-0 cursor-grab"
          onMouseDown={e => { e.preventDefault(); startDrag(e.clientY); }}
          onTouchStart={e => startDrag(e.touches[0].clientY)}
          onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientY); }}
          onTouchEnd={e => endDrag(e.changedTouches[0].clientY)}
        >
          <div className="flex justify-center pt-2.5 pb-1.5 pointer-events-none">
            <div className="w-11 h-1 bg-line rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 pb-3 border-b border-line-soft">
          <div className="min-w-0">
            <p className="text-[14.5px] font-bold tracking-tight text-ink truncate">
              {stops[0]?.value || 'Départ'} → {stops[stops.length - 1]?.value || 'Arrivée'}
            </p>
            <p className="text-[11.5px] text-muted mt-0.5">Départ maintenant · Arrivée prévue 08:50</p>
          </div>
          <button
            onClick={() => setSaved(v => !v)}
            className={`pressable w-9 h-9 rounded-xl flex items-center justify-center ml-2 shrink-0 ${
              saved ? 'bg-danger-soft text-danger' : 'bg-line-soft text-soft'
            }`}
          >
            <i className={`fa-${saved ? 'solid' : 'regular'} fa-heart`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3.5">
          <div className="flex gap-2 mb-3.5">
            <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-ink text-white">27 min</span>
            <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-line-soft text-ink">4,2 km</span>
            <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-line-soft text-ink">€ 1,80</span>
            <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-warning-soft text-warning">+05 min</span>
          </div>

          {itinerarySteps.map((s, i) => (
            <ItineraryStep key={i} {...s} isLast={i === itinerarySteps.length - 1} />
          ))}

          <button
            className="w-full h-13 bg-ink text-white rounded-2xl font-bold text-sm inline-flex items-center justify-center gap-2.5 mt-2"
            style={{ height: 52 }}
          >
            <i className="fa-solid fa-play" />
            Lancer la navigation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SearchPage shell
   ────────────────────────────────────────────────────────────────────────── */
export default function SearchPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('destination');
  const [query, setQuery] = useState('');
  const [stops, setStops] = useState([
    { id: 'start', value: 'Maison' },
    { id: 'end',   value: '' },
  ]);

  const handleBack = () => {
    if (step === 'destination') navigate(-1);
    else if (step === 'route') setStep('destination');
    else setStep('route');
  };

  const handleSelect = r => {
    setStops(prev => {
      const arr = [...prev];
      arr[arr.length - 1] = { ...arr[arr.length - 1], value: r.name };
      return arr;
    });
    setStep('route');
    setQuery('');
  };

  const handleSelectSaved = p => {
    setStops(prev => {
      const arr = [...prev];
      arr[arr.length - 1] = { ...arr[arr.length - 1], value: p.label };
      return arr;
    });
    setStep('route');
  };

  const TITLES = {
    destination: 'Où allez-vous ?',
    route:       'Votre itinéraire',
  };

  return (
    <div className="fixed inset-0 bg-warm-bg z-50 flex flex-col md:pl-64">
      {step !== 'itinerary' && (
        <div className="flex items-center gap-3 px-4 pt-14 pb-3 bg-warm-bg shrink-0">
          <button
            onClick={handleBack}
            className="pressable w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center shrink-0"
            aria-label="Retour"
          >
            <i className="fa-solid fa-chevron-left text-sm" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold tracking-tight text-ink pr-10">
            {TITLES[step]}
          </h1>
        </div>
      )}

      <div className={`flex-1 overflow-hidden w-full relative ${step !== 'itinerary' ? 'max-w-2xl mx-auto' : ''}`}>
        {step === 'destination' && (
          <DestinationStep
            query={query}
            onChange={setQuery}
            onSelect={handleSelect}
            onSelectSaved={handleSelectSaved}
          />
        )}
        {step === 'route' && (
          <RouteStep stops={stops} setStops={setStops} onConfirm={() => setStep('itinerary')} />
        )}
        {step === 'itinerary' && (
          <ItineraryView
            stops={stops}
            onBack={() => navigate(-1)}
            onEdit={() => setStep('route')}
            onSwap={() =>
              setStops(prev => {
                const arr = [...prev];
                [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
                return arr;
              })
            }
          />
        )}
      </div>
    </div>
  );
}
