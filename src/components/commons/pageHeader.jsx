export default function PageHeader({ title }) {
    return (
        <div className="flex items-center gap-2 mb-6">
            <a href="/" className="text-2xl">
                <i className="fa-solid fa-chevron-left w-10 h-10 border-2 rounded-full p-2" />
            </a>
            <h1 className="text-2xl font-semibold mx-auto pr-6">{title}</h1>
        </div>
    );
}
