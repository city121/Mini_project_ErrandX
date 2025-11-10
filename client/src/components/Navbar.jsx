import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
// 🆕 Added Scale (Terms) and Lock (Privacy) icons
import { LogOut, Sun, Moon, User, Settings as SettingsIcon, MoreVertical, Scale, Lock } from "lucide-react"; 

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // State to control the dropdown visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const menuRef = useRef(null); 

    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsMenuOpen(false); // Close menu on logout
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Tasks", path: "/tasks" },
        { name: "Profile", path: "/profile" },
        { name: "About", path: "/about" }, // ✅ ADDED ABOUT LINK
    ];

    // Dark/Light mode toggle (Unchanged)
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("darkMode") === "true"
    );

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    // Effect to handle closing the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);


    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
            
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center">
                
                {/* 1. Left Section: Logo/Name (Unchanged) */}
                <Link
                    to="/"
                    className="flex items-center space-x-2 text-2xl font-extrabold text-green-600 dark:text-green-400 tracking-tight absolute left-6 top-1/2 transform -translate-y-1/2"
                >
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>ErrandX</span>
                </Link>

                {/* 2. Center Section: Navigation Links (UPDATED) */}
                <div className="flex gap-8 text-lg">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`font-medium ${
                                location.pathname === link.path
                                    ? "text-green-600 dark:text-green-400 border-b-2 border-green-500 pb-1"
                                    : "text-gray-700 dark:text-gray-300 hover:text-green-500 hover:border-b-2 hover:border-green-500/50 pb-1"
                            } transition-all duration-200`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* 3. Right Section: User/Login + Dark Mode */}
                <div className="flex items-center gap-3 absolute right-6 top-1/2 transform -translate-y-1/2">
                    
                    {/* Dark/Light Toggle (Unchanged) */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {user ? (
                        /* 🆕 DROPDOWN MENU IMPLEMENTATION (UPDATED) */
                        <div ref={menuRef} className="relative inline-block text-left">
                            
                            {/* Dropdown Trigger (Three Dots) */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none"
                                aria-label="User Menu"
                            >
                                <MoreVertical className="w-6 h-6" />
                            </button>

                            {/* Dropdown Content */}
                            {isMenuOpen && (
                                <div 
                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none"
                                    role="menu" 
                                    aria-orientation="vertical" 
                                    aria-labelledby="menu-button"
                                >
                                    {/* 1. Logged-in User Name */}
                                    <div className="py-1 px-4">
                                        <div className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400 font-semibold truncate">
                                            <User className="inline-block w-4 h-4 mr-2 text-green-500" />
                                            {user.name}
                                        </div>
                                    </div>
                                    
                                    {/* 2. Menu Items */}
                                    <div className="py-1">
                                        <Link 
                                            to="/settings" 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            role="menuitem"
                                        >
                                            <SettingsIcon className="w-4 h-4 mr-3 text-blue-500" />
                                            Account Settings
                                        </Link>

                                        {/* ⚖️ TERMS OPTION ADDED */}
                                        <Link 
                                            to="/terms" 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            role="menuitem"
                                        >
                                            <Scale className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                                            Terms
                                        </Link>

                                        {/* 🔒 PRIVACY OPTION ADDED */}
                                        <Link 
                                            to="/privacy" 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            role="menuitem"
                                        >
                                            <Lock className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                                            Privacy
                                        </Link>
                                    </div>

                                    {/* 3. Logout Button */}
                                    <div className="py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700/50 transition-colors"
                                            role="menuitem"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Login/Register Buttons (Unchanged) */
                        <div className="flex gap-2">
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="hidden sm:block px-4 py-2 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all text-sm font-semibold"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}