import PageHeader from "../components/commons/pageHeader";
import TravelCard from "../components/myTravelPages/travelCard";

export default function MyTravel() {
    return (
        <div className="min-h-screen bg-[#050505] text-white px-4 pt-6 pb-10 relative">
            <PageHeader title="Mes Voyages" />

            <div className="flex flex-col">
                {/* Voyage actif avec collapse DaisyUI */}
                <div className="p-8 bg-[#191919] gap-20 sm:mx-4 md:mx-10 xl:mx-20 rounded-t-lg min-h-screen
  flex flex-col items-center justify-center 
  lg:grid lg:grid-cols-5 lg:items-start lg:justify-center">

                    <TravelCard
                        title="Consulat Algérie"
                        date="19/03/2025"
                        steps={[
                            {
                                mode: "Marche",
                                time: "06:30 am",
                                address: "8 rue des potiers",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:10 min"
                            },
                            {
                                mode: "Voiture",
                                time: "06:40 am",
                                address: "10 rue Fabert",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:30 min"
                            },
                            {
                                mode: "Avion",
                                time: "08:23 am",
                                address: "3 Avenue Charles de Gaulle",
                                city: "Luxembourg",
                                region: "Luxembourg",
                            }
                        ]}
                    />

                    <TravelCard
                        title="Aéroport"
                        date="19/03/2025"
                        steps={[
                            {
                                mode: "Marche",
                                time: "06:30 am",
                                address: "8 rue des potiers",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:10 min"
                            },
                        ]}
                    />
                    <TravelCard
                        title="Test"
                        date="19/03/2025"
                        steps={[
                            {
                                mode: "Marche",
                                time: "06:30 am",
                                address: "8 rue des potiers",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:10 min"
                            },
                            {
                                mode: "Voiture",
                                time: "06:40 am",
                                address: "10 rue Fabert",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:30 min"
                            },
                        ]}
                    />
                    <TravelCard
                        title="Prout prout"
                        date="19/03/2025"
                        steps={[
                            {
                                mode: "Marche",
                                time: "06:30 am",
                                address: "8 rue des potiers",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:10 min"
                            }
                        ]}
                    />
                    <TravelCard
                        title="Consulat Algérie"
                        date="19/03/2025"
                        steps={[
                            {
                                mode: "Marche",
                                time: "06:30 am",
                                address: "8 rue des potiers",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:10 min"
                            },
                            {
                                mode: "Voiture",
                                time: "06:40 am",
                                address: "10 rue Fabert",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:30 min"
                            },
                            {
                                mode: "Avion",
                                time: "08:23 am",
                                address: "3 Avenue Charles de Gaulle",
                                city: "Luxembourg",
                                region: "Luxembourg",
                            }
                        ]}
                    />
                    <TravelCard
                        title="Consulat Algérie"
                        date="19/03/2025"
                        steps={[
                            {
                                mode: "Marche",
                                time: "06:30 am",
                                address: "8 rue des potiers",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:10 min"
                            },
                            {
                                mode: "Voiture",
                                time: "06:40 am",
                                address: "10 rue Fabert",
                                city: "Metz",
                                region: "Grand Est",
                                duration: "00:30 min"
                            },
                            {
                                mode: "Avion",
                                time: "08:23 am",
                                address: "3 Avenue Charles de Gaulle",
                                city: "Luxembourg",
                                region: "Luxembourg",
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
