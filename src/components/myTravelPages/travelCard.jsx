export default function TravelCard({ title, date, steps = [] }) {
    return (
        <div className="collapse collapse-arrow bg-white w-full text-[#191919] rounded-xl shadow-md">
            <input type="checkbox" />
            <div className="collapse-title text-md font-semibold flex justify-between items-center">
                <div>
                    <div className="flex gap-4 ">
                        <i className="text-4xl text-[#191919] fa-solid fa-route mr-2" />
                        <div className="flex flex-col">
                            <p>{title}</p>
                            <div className="text-sm  mt-1">
                                <i className="fa-regular fa-calendar mr-1" />
                                {date}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="collapse-content">
                {steps.map((step, index) => (
                    <div key={index}>
                        {/* Étape */}
                        <div className="flex items-start w-full gap-3 mt-4 border-l-2 border-gray-300 pl-4 ml-3">
                            <div className="text-info mt-1">

                                <i className={`fa-solid ${step.mode === "Marche" ? "fa-person-walking" : step.mode === "Voiture" ? "fa-car" : "fa-plane"} text-info`} />
                            </div>
                            <div className="bg-[#191919] text-white rounded-lg p-3 w-full shadow-[#191919] shadow-md">
                                {/* Type de transport */}
                                <div className="text-xs flex justify-between text-orange-400 font-bold mb-2 uppercase">
                                    <span>{step.mode}</span>
                                    <span className="text-sm text-base-100">{step.time}</span>
                                </div>
                                {/* Infos trajet */}
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs">{step.address}</span>
                                        <span className="text-xs text-gray-400">
                                            {step.city} - {step.region}
                                        </span>
                                    </div>
                                    <a href="#" className="text-orange-500 text-sm font-semibold">Voir les détails</a>
                                </div>
                            </div>
                        </div>

                        {/* Délai entre les étapes (si défini) */}
                        {step.duration && (
                            <div className="text-center text-xs text-gray-400 mt-2 mb-2">{step.duration}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
