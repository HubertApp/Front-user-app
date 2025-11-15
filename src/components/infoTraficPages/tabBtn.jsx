export default function TabButton({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center cursor-pointer card bg-base-100 text-base-content rounded-lg w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40
                ${active ? "border-4 border-info" : "hover:border-4 hover:bg-info/20"}`}
        >
            <img src={icon} className="w-12 h-12 sm:w-16 sm:h-16" />
            <span className="font-bold text-sm sm:text-base text-center mt-2">
                {label}
            </span>
        </button>
    );
}
