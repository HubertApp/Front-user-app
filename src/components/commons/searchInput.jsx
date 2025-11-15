export default function SearchInput({icon}) {
    return (<div className="w-full max-w-md mb-6">
        <div className="relative">
            <input
                type="text"
                placeholder="Un pays, une destination..."
                className="w-full p-8 input input-lg rounded-lg pl-6 bg-white text-gray-900"
            />
            <button className="absolute inset-y-0 cursor-pointer right-0 flex justify-center items-center bg-info rounded-r-lg w-12">
                <i className={`${icon} text-white text-lg`}></i>
            </button>
        </div>
    </div>);
}