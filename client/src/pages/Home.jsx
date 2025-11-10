import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
// Removed: import CreatorBadge from "../components/CreatorBadge.jsx";
import { DollarSign, Zap, Shield, Users } from "lucide-react"; 

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col justify-between text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
            <Navbar />

            {/* 2. Main Content Area */}
            <main className="flex flex-col items-center justify-center px-6 pt-24 pb-16 flex-grow transition-colors duration-300">
                <div
                    className="w-full max-w-5xl 
                                 bg-white dark:bg-gray-800 
                                 border border-gray-100 dark:border-gray-700 
                                 shadow-2xl 
                                 rounded-3xl p-8 sm:p-12 lg:p-16 text-center transition-colors duration-300"
                >
                    {/* Header/CTA */}
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
                        <span className="text-gray-900 dark:text-gray-100">
                            Microtask Campus
                        </span>
                        <span
                            className="
                                 text-transparent bg-clip-text 
                                 bg-gradient-to-r from-green-500 to-teal-500 
                                 dark:from-green-400 dark:to-teal-400
                                 /* Glow Effect */
                                 [text-shadow:0_0_5px_rgba(52,211,163,0.7),0_0_10px_rgba(52,211,163,0.5)] 
                                 dark:[text-shadow:0_0_5px_rgba(74,222,128,0.5),0_0_15px_rgba(74,222,128,0.3)]
                            "
                        >
                             — ErrandX
                        </span>
                    </h1>
                    
                    {/* UPDATED DESCRIPTION */}
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Connect with students on campus for microtasks, earn rewards, and
                        help peers. Lightweight, fast, and built for college life. 🚀
                        Need notes from a class? Post a quick reward. Have 10 minutes free? Grab a task and get paid. It's the easiest way to manage quick campus needs and supplemental income.
                    </p>

                    {/* Primary Action Button */}
                    <Link
                        to="/tasks"
                        className="inline-block px-12 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-full shadow-xl shadow-green-500/30 transition-all transform hover:scale-105 hover:shadow-green-500/50 active:bg-green-800"
                    >
                        Explore Tasks
                    </Link>
                    
                    {/* REMOVED FEATURE GRID SECTION */}
                    
                </div>
            </main>

            {/* Footer (Removed contact links) */}
            <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-6 border-t border-gray-300 dark:border-gray-700 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-center items-center">
                    
                    {/* Links - Empty */}
                    <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-400 flex-wrap justify-center sm:justify-start">
                        {/* Links now on Contact page. */}
                    </div>
                </div>

                <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
                    © {new Date().getFullYear()} ErrandX. Built with ❤️ for Campus
                    Innovation.
                </p>
            </footer>

            {/* Removed CreatorBadge here */}
        </div>
    );
}