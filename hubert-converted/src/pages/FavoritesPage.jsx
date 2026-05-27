import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/map/MapView';
import BottomNav from '../components/layout/BottomNav';
import FavoriteCard from '../components/favorites/FavoriteCard';
import { favoriteRoutes } from '../data/mock';

const CARD_STEP = 252;

export default function FavoritesPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIdx(Math.round(el.scrollLeft / CARD_STEP));
  }, []);

  return (
    <div className="relative h-screen overflow-hidden md:pl-64 bg-warm-bg">
      <MapView className="absolute inset-0 z-0" withRoute withPin />

      {/* Top pills */}
      <div className="absolute top-14 left-4 right-4 z-10 flex gap-2 md:left-[calc(16rem+16px)] md:right-6 md:top-6">
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

      {/* Bottom carousel */}
      <div className="absolute bottom-24 md:bottom-0 left-0 right-0 md:left-64 z-10">
        <div className="bg-warm-bg/86 backdrop-blur-md py-3" style={{ background: 'rgba(246,247,244,0.86)' }}>
          <div className="flex items-end justify-between px-5 pb-3">
            <div>
              <p className="eyebrow">Trajets favoris</p>
              <p className="text-base font-bold tracking-tight mt-0.5">
                {favoriteRoutes.length} routes épinglées
              </p>
            </div>
            <button className="pressable h-8 px-3 rounded-[10px] bg-white border border-line text-[12px] font-semibold inline-flex items-center gap-1.5">
              <i className="fa-solid fa-plus text-[10px]" />
              Ajouter
            </button>
          </div>

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex gap-3 overflow-x-auto px-5 pb-2 pt-1 snap-x snap-mandatory md:justify-start"
          >
            {favoriteRoutes.map(r => (
              <FavoriteCard key={r.id} {...r} />
            ))}
            <div className="shrink-0 w-2" />
          </div>

          <div className="flex justify-center items-center gap-1.5 pt-2">
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

      <BottomNav />
    </div>
  );
}
