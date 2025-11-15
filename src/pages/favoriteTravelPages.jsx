import { useState, useEffect } from "react";
import PageHeader from "../components/commons/pageHeader";
import MapComponent from "../components/commons/map";
import SearchInput from "../components/commons/searchInput";
import TravelCard from "../components/favoriteTravelPages/travelCard";

export default function FavoriteTravelPages() {
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShowMap(true), 300);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {showMap && <MapComponent />}

            {/* Barre de recherche centrée */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-xl px-4">
                <div className="flex justify-center">
                    <SearchInput icon="fa-regular fa-heart" />
                </div>
            </div>

            {/* Cartes centrées en bas */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-5xl px-4">
                <div
                    className="
            flex sm:flex-row flex-nowrap sm:overflow-visible overflow-x-auto 
            gap-4 p-4 rounded-t-2xl shadow-lg
        "
                >
                    {/* Cartes scrollables sur mobile */}
                    <div className="sm:w-auto min-w-[280px]">
                        <TravelCard
                            from="Maison"
                            to="12 rue du Maréchal Pétain"
                            departureTime="7h00"
                            arrivalTime="7h20"
                            duration="0H20"
                        />
                    </div>
                    <div className="sm:w-auto min-w-[280px]">
                        <TravelCard
                            from="Maison"
                            to="Place d’Armes, Metz"
                            departureTime="8h00"
                            arrivalTime="8h25"
                            duration="0H25"
                        />
                    </div>
                    {/* Ajoute autant de cartes que nécessaire */}
                </div>
            </div>

        </div>
    );
}
