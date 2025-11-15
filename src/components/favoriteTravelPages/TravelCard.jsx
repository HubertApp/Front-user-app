import car from "../../img/car.png";

export default function TravelCard({ from, to, departureTime, arrivalTime, duration }) {
    return (
        <div className="card w-full max-w-sm cursor-pointer backdrop-blur-md bg-white text-black shadow-xl border-2 border-white">
            <div className="card-body px-4 py-3">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <div className="text-base font-bold">{from}</div>
                    <i className="text-xl fa-solid fa-heart"></i>
                </div>

                {/* Car Icon */}
                <div className="flex justify-center py-2">
                    <img src={car} alt="car" className="w-24 h-24 object-contain" />
                </div>

                <div className="divider my-2" />

                {/* Infos */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Départ</span>
                        <span>{departureTime}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                        <span>Arrivée</span>
                        <span>{arrivalTime}</span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                        <div className="badge badge-outline badge-md flex items-center gap-1">
                            <i className="fa-regular fa-clock"></i>
                            {duration}
                        </div>
                    </div>
                    <div className="text-center mt-1 text-xs text-gray-600">{to}</div>
                </div>
            </div>
        </div>
    );
}
