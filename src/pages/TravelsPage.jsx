import PageHeader from '../components/layout/PageHeader';
import TravelCard from '../components/travels/TravelCard';
import BottomNav from '../components/layout/BottomNav';
import { myTravels } from '../data/mock';

export default function TravelsPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#0f172a] md:pl-60">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24 md:pb-10">
        <PageHeader title="Mes Voyages" />

        <div className="mt-4 flex flex-col gap-3">
          {myTravels.map(travel => (
            <TravelCard key={travel.id} {...travel} />
          ))}
        </div>

        {myTravels.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-[#64748b] gap-3">
            <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center">
              <i className="fa-solid fa-route text-2xl text-teal" />
            </div>
            <p className="text-sm font-medium">Aucun voyage enregistré</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
