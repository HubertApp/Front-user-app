export default function Link({ title, icon }) {
    return (
        <button className="flex flex-col items-center">
            <div className="w-6 h-6 mb-1 rounded-full"><i className={icon}></i></div>
            <span className="text-white text-sm">{title}</span>
        </button>
    );
}