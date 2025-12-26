const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-12 border-t border-gray-800">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                <p className="text-xl font-bold tracking-wide text-indigo-400">
                    Made by Azhar Zia (Web Developer)
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-lg font-medium">Contact # 0323-7477816</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
