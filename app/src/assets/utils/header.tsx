import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";


export default function Header() {

    return (
        <header className="w-full backdrop-blur-sm bg- bg-[#800020] sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-2 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center text-white font-bold mr-2">
                            <Image src={require('../../images/restaurant.png')}
                                className="h-10 w-16 rounded-full"
                                alt="Speedy Automobile Services"
                            />
                        </div>

                        <div className="hidden sm:flex flex-col">
                            <h1 className="sm:text-lg font-semibold text-[#FFD700]">Noon Al Zaki Restaurant</h1>
                            <p className="text-sm text-[#FFD700] ">مطعم نون الذكي</p>
                        </div>
                    </div>
                    {/* <nav aria-label="Main navigation" className="hidden md:flex gap-3 ml-6">
                        <Link href="/" className="px-3 py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-800">Home</Link>
                        <Link href="/about" className="px-3 py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-800">About</Link>
                        <Link href="/contact" className="px-3 py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-800">Contact</Link>
                    </nav> */}
                </div>

                {/* <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-3 ml-2">
                        <a role="button" aria-label="Call Speedy now" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-lg hover:opacity-95">
                            Call now
                        </a>
                        <a role="button" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Speedy" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:opacity-95">
                            WhatsApp
                        </a>
                    </div>
                </div> */}
                <SearchBar />
                <div className="h-10 w-10 flex flex-col items-center justify-center">
                    <Image src={require('../../images/shopping-cart.png')} alt="cart" width={6} height={6} className="h-6 w-6" />
                </div>
            </div>
        </header>
    )
}