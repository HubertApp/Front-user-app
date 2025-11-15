export default function Header() {
    return (
        <header className="navbar bg-base-100">
            <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 md:hidden z-50">
                <a href="/move" class="flex flex-col items-center text-sm text-gray-600 hover:text-black">
                    <span>Let's move</span>
                </a>
                <a href="/favoris" class="flex flex-col items-center text-sm text-gray-600 hover:text-black">
                    <span>Favoris</span>
                </a>
                <a href="/compte" class="flex flex-col items-center text-sm text-gray-600 hover:text-black">
                    <span>Compte</span>
                </a>
            </nav>
        </header>
    );
}