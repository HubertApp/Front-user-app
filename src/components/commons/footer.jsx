import Link from "./link";

export default function Footer() {
    return (
        <>
            {/* Footer mobile (navbar) */}
            <footer className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-700 p-3 px-6 flex justify-between lg:hidden z-50">
                <Link title="Let's move" icon="fa-solid fa-route" />
                <Link title="Favoris" icon="fa-solid fa-star  " />
                <Link title="Compte" icon="fa-solid fa-user" />
            </footer>

            {/* Footer desktop */}
            <footer className="hidden lg:flex w-full p-4 flex-col items-center">
                <hr className="border-white border-t-1 w-full mb-4" />
                <div className="flex justify-between w-full max-w-md">
                    <Link title="Let's move" icon="fa-solid fa-route" />
                    <Link title="Favoris" icon="fa-solid fa-star  " />
                    <Link title="Compte" icon="fa-solid fa-user" />
                </div>
            </footer>
        </>
    );
}