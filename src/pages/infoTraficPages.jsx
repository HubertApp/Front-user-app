import { useState } from "react";
import InfoTraficComponent from "../components/infoTraficPages/infoTrafic";
import car from "../img/car.png";
import target from "../img/target.png";
import TabButton from "../components/infoTraficPages/tabBtn";
import PageHeader from "../components/commons/pageHeader";

export default function InfoTrafic() {
    const [activeTab, setActiveTab] = useState("trajets");

    return (
        <div className="min-h-screen bg-[#050505] text-white px-4 pt-6 pb-10 relative">
            <PageHeader title="Info Trafic" />

            <section className="flex flex-col items-center mt-8 bg-[#191919] gap-20 sm:mx-4 md:mx-10 xl:mx-20 rounded-t-lg min-h-screen">
                <div className="flex flex-wrap justify-evenly py-10 w-full">
                    <TabButton icon={car} label="Mes trajets" active={activeTab === "trajets"} onClick={() => setActiveTab("trajets")} />
                    <TabButton icon={target} label="Ma position" active={activeTab === "position"} onClick={() => setActiveTab("position")} />
                </div>

                <div className="w-full flex md:flex-row flex-col gap-10 justify-center px-4 md:px-10 lg:px-20 pb-10">
                    {activeTab === "trajets" ? (
                        <>
                            <InfoTraficComponent />
                            <InfoTraficComponent />
                        </>
                    ) : (
                        <div className="card bg-base-100 p-6 text-base-content">
                            <p className="text-center">📍 Affichage de la position utilisateur à venir ici...</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
