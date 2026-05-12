import { useState } from 'react';
import car from '../../img/car.png';

export default function FavoriteCard({ from, to, departureTime, arrivalTime, duration, isFavorited = true }) {
  const [fav, setFav] = useState(isFavorited);

  return (
    <div className="bg-white rounded-2xl p-4 w-64 shadow-lg text-gray-900 shrink-0">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-base">{from}</p>
          <p className="text-xs text-gray-500 mt-0.5 max-w-[160px] truncate">{to}</p>
        </div>
        <button
          onClick={() => setFav(f => !f)}
          className="transition-colors"
          aria-label="Ajouter aux favoris"
        >
          <i className={`fa-${fav ? 'solid' : 'regular'} fa-heart text-xl ${fav ? 'text-red-500' : 'text-gray-300'}`} />
        </button>
      </div>

      <div className="flex justify-center my-3">
        <img src={car} alt="transport" className="w-20 h-16 object-contain" loading="lazy" />
      </div>

      <div className="border-t border-gray-100 pt-3 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 w-14">Départ</span>
            <span className="font-semibold text-gray-900">{departureTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 w-14">Arrivée</span>
            <span className="font-semibold text-gray-900">{arrivalTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
          <i className="fa-regular fa-clock text-gray-500 text-xs" />
          <span className="text-xs font-semibold text-gray-700">{duration}</span>
        </div>
      </div>
    </div>
  );
}
