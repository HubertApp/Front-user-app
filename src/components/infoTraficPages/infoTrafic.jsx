export default function InfoTraficComponent() {
    return (
        <div className="bg-white w-fit py-10 text-base-content p-4 rounded-lg relative">
            <div className="flex items-center w-full gap-4">
                <div className="text-orange-500 text-5xl flex-shrink-0">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div className="flex flex-col gap-2 flex-grow w-full pr-20 pb-6">
                    <span className="font-bold">Perturbations sur la route :</span>
                    <span className="whitespace-normal break-words">
                        Travaux publique sur le trajet "Travail" à rue des potiers
                    </span>
                </div>
            </div>
            <div className="absolute bottom-4 right-4">
                <span className="text-orange-500 font-bold text-md">Retardé 0H05</span>
            </div>
        </div>
    );
}