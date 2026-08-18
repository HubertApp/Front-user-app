import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/map/MapView';
import BottomNav from '../components/layout/BottomNav';
import FavoriteCard from '../components/favorites/FavoriteCard';
import { useTheme } from '../context/ThemeContext';
import { favoriteRoutes } from '../data/mock';
import { usePageMeta } from '../hooks/usePageMeta';

const CARD_STEP = 252;
const HEADER_H = 64;
const OPEN_H = 384;

export default function FavoritesPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelH, setPanelH] = useState(OPEN_H);
  const [isDragging, setIsDragging] = useState(false);
  const { dark, collapsed } = useTheme();
  const panelBg = dark ? 'rgba(14, 26, 36, 0.92)' : 'rgba(246,247,244,0.86)';
  usePageMeta({ title: 'Favoris', description: 'Accédez rapidement à vos trajets favoris et itinéraires enregistrés.', path: '/favoris' });

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIdx(Math.round(el.scrollLeft / CARD_STEP));
  }, []);

  // Le panneau ne s'ouvre/ferme que par un tiré vers le haut ou le bas sur
  // la poignée (pas de clic), et suit le curseur/doigt en direct pendant le
  // tiré au lieu de basculer d'un coup au relâchement.
  const dragRef = useRef({ active: false, startY: 0, startH: OPEN_H });
  const heightRef = useRef(OPEN_H);

  const handleDragStart = useCallback(clientY => {
    dragRef.current = { active: true, startY: clientY, startH: heightRef.current };
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(clientY => {
    if (!dragRef.current.active) return;
    const delta = clientY - dragRef.current.startY;
    const newH = Math.max(HEADER_H, Math.min(OPEN_H, dragRef.current.startH - delta));
    heightRef.current = newH;
    setPanelH(newH);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    const mid = (HEADER_H + OPEN_H) / 2;
    const target = heightRef.current > mid ? OPEN_H : HEADER_H;
    heightRef.current = target;
    setPanelH(target);
    setPanelOpen(target === OPEN_H);
  }, []);

  useEffect(() => {
    const onMouseMove = e => {
      if (!dragRef.current.active) return;
      e.preventDefault();
      handleDragMove(e.clientY);
    };
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = e => {
      if (!dragRef.current.active) return;
      e.preventDefault();
      handleDragMove(e.touches[0].clientY);
    };
    const onTouchEnd = () => handleDragEnd();

    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  return (
    <div className={`relative h-screen overflow-hidden bg-warm-bg ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
      <MapView className="absolute inset-0 z-0" withRoute withPin />

      {/* Top pills */}
      <div className="absolute top-14 left-4 right-4 z-10 flex gap-2 sidebar-left-p md:right-6 md:top-6">
        <button
          onClick={() => navigate('/recherche')}
          className="pressable flex-1 min-w-0 h-11 bg-white rounded-2xl px-3.5 flex items-center gap-2 text-[13px] font-semibold text-ink"
          style={{ boxShadow: '0 4px 16px -6px rgba(15,26,36,0.16)' }}
        >
          <i className="fa-solid fa-heart text-teal" />
          <span>Maison</span>
          <i className="fa-solid fa-chevron-down text-soft text-[11px] ml-auto" />
        </button>
        <button
          onClick={() => navigate('/recherche')}
          className="pressable shrink-0 w-11 h-11 bg-white rounded-2xl flex items-center justify-center"
          style={{ boxShadow: '0 4px 16px -6px rgba(15,26,36,0.16)' }}
          aria-label="Filtres"
        >
          <i className="fa-solid fa-sliders text-ink-2" />
        </button>
      </div>

      {/* Map controls stacked */}
      <div className="absolute right-4 top-32 z-10 flex flex-col gap-2 md:right-6">
        {['fa-location-crosshairs', 'fa-plus', 'fa-minus'].map((ic, i) => (
          <button
            key={i}
            className="pressable w-10 h-10 rounded-xl bg-white border border-line flex items-center justify-center"
            style={{ boxShadow: '0 4px 12px -4px rgba(15,26,36,0.18)' }}
          >
            <i className={`fa-solid ${ic} text-sm`} />
          </button>
        ))}
      </div>

      {/* Bottom panel */}
      <div className="absolute bottom-[72px] md:bottom-0 left-0 right-0 sidebar-left z-10 mb-2 md:mb-0">
        <div
          className="backdrop-blur-md rounded-t-3xl overflow-hidden"
          style={{
            background: panelBg,
            height: panelH,
            transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {/* Handle + header — pas de clic, suit le doigt/curseur pendant le tiré */}
          <div
            onMouseDown={e => { e.preventDefault(); handleDragStart(e.clientY); }}
            onTouchStart={e => handleDragStart(e.touches[0].clientY)}
            className="w-full px-5 pt-3 pb-3 flex items-center gap-3 text-left cursor-grab active:cursor-grabbing touch-none select-none"
          >
            {/* drag handle pill */}
            <span className="absolute left-1/2 -translate-x-1/2 top-2 w-8 h-1 rounded-full bg-soft/40" />

            <div className="flex-1 min-w-0 mt-2">
              <p className="eyebrow">Trajets favoris</p>
              <p className="text-base font-bold tracking-tight mt-0.5">
                {favoriteRoutes.length} routes épinglées
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2 shrink-0">
              {!panelOpen && (
                <span className="h-7 px-2.5 rounded-lg bg-white border border-line text-[11px] font-semibold text-ink inline-flex items-center gap-1">
                  Voir
                </span>
              )}
              <i
                className={`fa-solid fa-chevron-down text-soft text-[12px] transition-transform duration-300 ${
                  panelOpen ? '' : 'rotate-180'
                }`}
              />
            </div>
          </div>

          {/* Contenu — révélé/masqué par la hauteur du conteneur parent */}
          <div>
            {/* Add button row */}
            <div className="flex justify-end px-5 pb-3 -mt-1">
              <button className="pressable h-8 px-3 rounded-[10px] bg-white border border-line text-[12px] font-semibold inline-flex items-center gap-1.5">
                <i className="fa-solid fa-plus text-[10px]" />
                Ajouter
              </button>
            </div>

            <div
              ref={scrollRef}
              onScroll={onScroll}
              className="flex justify-center gap-3 overflow-x-auto px-5 pb-2 pt-1 snap-x snap-mandatory md:justify-start"
            >
              {favoriteRoutes.map(r => (
                <FavoriteCard key={r.id} {...r} />
              ))}
              <div className="shrink-0 w-2" />
            </div>

            <div className="flex justify-center items-center gap-1.5 pt-2 pb-3">
              {favoriteRoutes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollRef.current?.scrollTo({ left: i * CARD_STEP, behavior: 'smooth' })}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIdx ? 'w-4 h-1.5 bg-teal' : 'w-1.5 h-1.5 bg-soft/40 hover:bg-soft/70'
                  }`}
                  aria-label={`Carte ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
