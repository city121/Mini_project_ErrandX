import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import WavyText from "../components/WavyText.jsx"; // Assuming WavyText is in your components folder
import { DollarSign, Zap, Shield, Users } from "lucide-react";

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col justify-between text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <main className="flex flex-col items-center justify-center px-6 pt-24 pb-16 flex-grow transition-colors duration-300">
                <div
                    className="w-full max-w-5xl
                                bg-white dark:bg-gray-800
                                border border-gray-100 dark:border-gray-700
                                shadow-2xl
                                rounded-3xl p-8 sm:p-12 lg:p-16 text-center transition-colors duration-300"
                >
                    <div className="flex justify-center mb-8">
                        <div className="w-30 h-30 sm:w-42 sm:h-52 rounded-full bg-green-500/10 dark:bg-green-400/10 p-4 border-2 border-green-500/50 dark:border-green-400/50 shadow-inner">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwZaTT7A-JWPeULG3vvFWhBFuk0lOIPN5MiA&s"
                                alt="ErrandX Logo"
                                className="w-full h-full object-contain rounded-full"
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
                        {/* 🚨 Wavy Text for "Microtask Campus" (Green Color) */}
                        <WavyText
                            text="Microtask Campus"
                            className="
                                text-green-600 dark:text-green-400
                                inline-block
                                [text-shadow:0_0_5px_rgba(16,185,129,0.7),0_0_10px_rgba(16,185,129,0.5)]
                            "
                            // Using a shorter delay for a tighter wave
                            delay={0.07} 
                        />
                        {/* Wavy Text for "— ErrandX" (Gradient Color) */}
                        <WavyText
                            text="— ErrandX"
                            className="errandx-wavy-gradient inline-block ml-2"
                        />
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Connect with students on campus for microtasks, earn rewards, and
                        help peers. Lightweight, fast, and built for college life. 🚀
                        Need notes from a class? Post a quick reward. Have 10 minutes free? Grab a task and get paid. It's the easiest way to manage quick campus needs and supplemental income.
                    </p>

                    <Link
                        to="/tasks"
                        className="inline-block px-12 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-full shadow-xl shadow-green-500/30 transition-all transform hover:scale-105 hover:shadow-green-500/50 active:bg-green-800"
                    >
                        Explore Tasks
                    </Link>

                </div>
            </main>

            <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-6 border-t border-gray-300 dark:border-gray-700 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-center items-center">

                    <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-400 flex-wrap justify-center sm:justify-start">
                    </div>
                </div>

                <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
                    © {new Date().getFullYear()} ErrandX. Built with ❤️ for Campus
                    Innovation.
                </p>
            </footer>
        </div>
    );
}