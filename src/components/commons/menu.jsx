import thumbsUp from "../../img/thumb-up.png";
export default function Menu({ title, link = "#", image, most_use = false }) {
    return (
        <a href={link} className={`flex flex-col items-center justify-center text-gray-900 bg-white p-4 rounded-lg w-full ${most_use ? "md:w-48" : "md:w-30"}`}>
            <div className="w-12 h-12 mb-2 rounded-full"><img src={image ?? thumbsUp}></img></div>
            <span className="text-center w-fit text-sm">{title}</span>
        </a>
    );
}