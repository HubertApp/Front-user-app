import { useRef, useState, useCallback, useEffect } from 'react';
import MapView from '../components/map/MapView';
import SearchBar from '../components/ui/SearchBar';
import FavoriteCard from '../components/favorites/FavoriteCard';
import BottomNav from '../components/layout/BottomNav';
import { favoriteRoutes } from '../data/mock';

const CARD_STEP = 272;

function FavoritesCarousel({ routes }) {
  const scrollRef = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(routes.length > 1);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const left  = el.scrollLeft;
    const maxSL = el.scrollWidth - el.clientWidth;
    setCanLeft(left > 8);
    setCanRight(left < maxSL - 8);
    setActiveIdx(Math.round(left / CARD_STEP));
  }, []);

  const scroll = dir =>
    scrollRef.current?.scrollBy({ left: dir * CARD_STEP, behavior: 'smooth' });

  return (
    <div className="relative select-none">
      {canLeft && (
        <div className="absolute left-0 inset-y-0 w-14 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none rounded-l" />
      )}
      {canRight && (
        <div className="absolute right-0 inset-y-0 w-14 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none rounded-r" />
      )}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto px-4 pb-3 pt-2 snap-x snap-mandatory md:justify-center"
        style={{ scrollbarWidth: 'none' }}
      >
        {routes.map(route => (
          <div key={route.id} className="snap-start shrink-0">
            <FavoriteCard {...route} />
          </div>
        ))}
        <div className="shrink-0 w-2" aria-hidden="true" />
      </div>

      {canLeft && (
        <button
          onClick={() => scroll(-1)}
          className="flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 active:scale-95 transition-all z-20"
          aria-label="Précédent"
        >
          <i className="fa-solid fa-chevron-left text-gray-900 text-xs" />
        </button>
      )}

      {canRight && (
        <button
          onClick={() => scroll(1)}
          className="flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 active:scale-95 transition-all z-20"
          aria-label="Suivant"
        >
          <i className="fa-solid fa-chevron-right text-gray-900 text-xs" />
        </button>
      )}

      {routes.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 pb-1 pt-0.5">
          {routes.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollRef.current?.scrollTo({ left: i * CARD_STEP, behavior: 'smooth' })}
              aria-label={`Carte ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? 'w-4 h-1.5 bg-teal'
                  : 'w-1.5 h-1.5 bg-[#cbd5e1] hover:bg-[#94a3b8]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <div className="relative h-screen overflow-hidden md:pl-60">
      <MapView className="absolute inset-0 z-0" />

      <div className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6">
        <div className="max-w-lg mx-auto">
          <SearchBar placeholder="Maison" icon="fa-heart" />
        </div>
      </div>

      <div className="absolute bottom-16 md:bottom-0 left-0 right-0 md:left-60 z-10">
        <div className="bg-white/92 backdrop-blur-md border-t border-[#e2e8f0] py-3">
          <FavoritesCarousel routes={favoriteRoutes} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
