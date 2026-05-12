import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/map/MapView';
import AutocompleteItem from '../components/search/AutocompleteItem';
import ItineraryStep from '../components/itinerary/ItineraryStep';
import { autocompleteResults, savedPlaces, itinerarySteps } from '../data/mock';

function DestinationSearch({ query, onChange, onSelectSaved, onSelectResult }) {
  const showAutocomplete = query.length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => onChange(e.target.value)}
            autoFocus
            placeholder="Un pays, une destination..."
            className="w-full h-14 pl-5 pr-16 bg-[#f1f5f9] text-[#0f172a] rounded-xl text-sm font-medium outline-none placeholder-[#94a3b8] shadow-sm ring-1 ring-[#e2e8f0] focus:ring-teal transition-all"
          />
          <button className="absolute right-0 top-0 h-14 w-14 flex items-center justify-center bg-teal rounded-r-xl">
            <i className="fa-solid fa-map-location-dot text-white text-base" />
          </button>
        </div>
      </div>

      {!showAutocomplete && (
        <div className="px-4 flex flex-wrap gap-2">
          {savedPlaces.map(place => (
            <button
              key={place.id}
              onClick={() => onSelectSaved(place)}
              className="flex items-center gap-2 bg-white text-[#0f172a] rounded-xl px-4 py-2.5 font-semibold text-sm hover:bg-[#f1f5f9] transition-colors shadow-sm ring-1 ring-[#e2e8f0]"
            >
              <i className={`fa-solid ${place.icon} text-teal text-sm`} />
              {place.label}
            </button>
          ))}
        </div>
      )}

      {showAutocomplete && (
        <div className="flex-1 overflow-y-auto">
          <p className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-widest px-4 py-3">
            Villes, Gares et Stations
          </p>
          {autocompleteResults.map(result => (
            <AutocompleteItem
              key={result.id}
              {...result}
              onClick={() => onSelectResult(result)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RouteInputs({ destination, onConfirm }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(destination ?? '');

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-[#e2e8f0] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#f1f5f9]">
          <div className="w-2.5 h-2.5 rounded-full bg-teal shrink-0" />
          <input
            type="text"
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder="Votre position"
            className="flex-1 text-[#0f172a] text-sm outline-none placeholder-[#94a3b8] font-medium bg-transparent"
          />
          <button className="text-teal shrink-0" aria-label="Utiliser ma position">
            <i className="fa-solid fa-location-crosshairs text-lg" />
          </button>
        </div>
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#0f172a] shrink-0" />
          <input
            type="text"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="Où aller ?"
            className="flex-1 text-[#0f172a] text-sm outline-none placeholder-[#94a3b8] font-medium bg-transparent"
          />
        </div>
      </div>

      <button className="flex items-center gap-2 text-teal text-sm font-semibold">
        <i className="fa-solid fa-location-dot" />
        Utiliser votre position
      </button>

      <div className="flex gap-2 flex-wrap">
        {savedPlaces.map(place => (
          <button
            key={place.id}
            onClick={() => setFrom(place.label)}
            className="flex items-center gap-2 bg-white text-[#0f172a] rounded-xl px-4 py-2.5 font-semibold text-sm shadow-sm ring-1 ring-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors"
          >
            <i className={`fa-solid ${place.icon} text-teal text-sm`} />
            {place.label}
          </button>
        ))}
      </div>

      <button
        onClick={onConfirm}
        disabled={!from && !to}
        className="w-full h-13 bg-teal text-white rounded-xl font-bold text-sm hover:bg-teal-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2 py-4"
      >
        Rechercher un itinéraire
      </button>
    </div>
  );
}

const SNAPS = { peek: 88, mid: 0.5, full: 0.85 };

function snapPx(key, winH) {
  if (key === 'peek') return SNAPS.peek;
  if (key === 'mid')  return Math.round(winH * SNAPS.mid);
  return Math.round(winH * SNAPS.full);
}

function nearestSnap(h, winH) {
  const vals = {
    peek: snapPx('peek', winH),
    mid:  snapPx('mid',  winH),
    full: snapPx('full', winH),
  };
  return Object.entries(vals).reduce((best, [k, v]) =>
    Math.abs(v - h) < Math.abs(vals[best] - h) ? k : best, 'peek');
}

function ItineraryView() {
  const [saved,     setSaved]     = useState(false);
  const [panelH,    setPanelH]    = useState(SNAPS.peek);
  const [animating, setAnimating] = useState(false);

  const drag = useRef({ on: false, startY: 0, startH: 0, moved: false });
  const curH = useRef(SNAPS.peek);
  const winH = useRef(window.innerHeight);

  useEffect(() => {
    const onResize = () => { winH.current = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const snapTo = useCallback((key) => {
    const h = snapPx(key, winH.current);
    curH.current = h;
    setAnimating(true);
    setPanelH(h);
  }, []);

  const onTransitionEnd = useCallback(() => setAnimating(false), []);

  const startDrag = useCallback((clientY) => {
    drag.current = { on: true, startY: clientY, startH: curH.current, moved: false };
  }, []);

  const moveDrag = useCallback((clientY) => {
    if (!drag.current.on) return;
    const delta = drag.current.startY - clientY;
    const newH = Math.max(SNAPS.peek, Math.min(snapPx('full', winH.current), drag.current.startH + delta));
    if (Math.abs(delta) > 4) drag.current.moved = true;
    curH.current = newH;
    setAnimating(false);
    setPanelH(newH);
  }, []);

  const endDrag = useCallback((clientY) => {
    if (!drag.current.on) return;
    drag.current.on = false;
    if (!drag.current.moved) {
      const cur = nearestSnap(curH.current, winH.current);
      const next = cur === 'peek' ? 'mid' : cur === 'mid' ? 'full' : 'peek';
      snapTo(next);
      return;
    }
    const delta = drag.current.startY - clientY;
    const snaps = ['peek', 'mid', 'full'];
    const curIdx = snaps.indexOf(nearestSnap(curH.current, winH.current));
    let targetKey;
    if (Math.abs(delta) > 60) {
      targetKey = delta > 0
        ? snaps[Math.min(curIdx + 1, 2)]
        : snaps[Math.max(curIdx - 1, 0)];
    } else {
      targetKey = nearestSnap(curH.current, winH.current);
    }
    snapTo(targetKey);
  }, [snapTo]);

  useEffect(() => {
    const onMouseMove = e => moveDrag(e.clientY);
    const onMouseUp   = e => endDrag(e.clientY);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, [moveDrag, endDrag]);

  return (
    <div className="relative h-full">
      <MapView className="absolute inset-0 z-0" zoom={11} />

      <div className="absolute top-0 left-0 right-0 z-10 p-3">
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 max-w-lg mx-auto ring-1 ring-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-teal shrink-0" />
                <span className="text-[#0f172a] text-sm font-medium">8 rue des potiers</span>
              </div>
              <div className="h-px bg-[#f1f5f9]" />
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-sm bg-[#0f172a] shrink-0" />
                <span className="text-[#0f172a] text-sm font-medium">235th Barber Street</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button className="w-7 h-7 bg-[#f1f5f9] rounded-full flex items-center justify-center hover:bg-[#e2e8f0] transition-colors">
                <i className="fa-solid fa-plus text-[#64748b] text-xs" />
              </button>
              <button className="w-7 h-7 bg-[#f1f5f9] rounded-full flex items-center justify-center hover:bg-[#e2e8f0] transition-colors">
                <i className="fa-solid fa-arrows-up-down text-[#64748b] text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        onTransitionEnd={onTransitionEnd}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          height: `${panelH}px`,
          transition: animating ? 'height 0.3s cubic-bezier(0.32,0.72,0,1)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          onMouseDown={e => { e.preventDefault(); startDrag(e.clientY); }}
          onTouchStart={e => startDrag(e.touches[0].clientY)}
          onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientY); }}
          onTouchEnd={e => endDrag(e.changedTouches[0].clientY)}
          style={{ touchAction: 'none', flexShrink: 0, cursor: 'grab' }}
        >
          <div className="flex justify-center pt-3 pb-2 pointer-events-none">
            <div className="w-10 h-1 bg-[#e2e8f0] rounded-full" />
          </div>

          <div className="flex items-center justify-between px-4 pb-3 pointer-events-none">
            <p className="text-[#64748b] text-xs">8 rue des potiers → 235th Barber Street</p>
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => setSaved(s => !s)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors pointer-events-auto"
            >
              <i className={`fa-${saved ? 'solid' : 'regular'} fa-heart text-sm ${saved ? 'text-red-500' : 'text-[#94a3b8]'}`} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {itinerarySteps.map((step, i) => (
            <ItineraryStep
              key={i}
              {...step}
              isLast={i === itinerarySteps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('destination');
  const [query, setQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');

  const handleSelectResult = useCallback(result => {
    setSelectedDestination(result.name);
    setStep('route');
    setQuery('');
  }, []);

  const handleSelectSaved = useCallback(place => {
    setSelectedDestination(place.label);
    setStep('route');
  }, []);

  const handleBack = () => {
    if (step === 'destination') navigate(-1);
    else if (step === 'route') setStep('destination');
    else if (step === 'itinerary') setStep('route');
  };

  const TITLES = {
    destination: 'Rechercher',
    route: 'Rechercher',
    itinerary: 'Itinéraire',
  };

  return (
    <div className="fixed inset-0 bg-[#f5f7fa] z-50 flex flex-col md:pl-60">
      {step !== 'itinerary' && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e2e8f0] shrink-0 bg-white">
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center border border-[#e2e8f0] rounded-full hover:bg-[#f1f5f9] transition-colors shrink-0"
            aria-label="Retour"
          >
            <i className="fa-solid fa-chevron-left text-sm text-[#64748b]" />
          </button>
          <h1 className="text-lg font-semibold flex-1 text-center text-[#0f172a]">{TITLES[step]}</h1>
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f1f5f9] transition-colors"
            aria-label="Fermer"
          >
            <i className="fa-solid fa-xmark text-sm text-[#64748b]" />
          </button>
        </div>
      )}

      {step === 'itinerary' && (
        <div className="absolute top-3 left-3 z-20 md:left-[calc(240px+12px)]">
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-[#f1f5f9] transition-colors"
            aria-label="Retour"
          >
            <i className="fa-solid fa-chevron-left text-[#0f172a] text-sm" />
          </button>
        </div>
      )}

      <div className={`flex-1 overflow-hidden w-full relative ${step !== 'itinerary' ? 'max-w-2xl mx-auto' : ''}`}>
        {step === 'destination' && (
          <DestinationSearch
            query={query}
            onChange={setQuery}
            onSelectSaved={handleSelectSaved}
            onSelectResult={handleSelectResult}
          />
        )}
        {step === 'route' && (
          <RouteInputs
            destination={selectedDestination}
            onConfirm={() => setStep('itinerary')}
          />
        )}
        {step === 'itinerary' && <ItineraryView />}
      </div>
    </div>
  );
}
