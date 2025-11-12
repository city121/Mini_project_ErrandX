import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext.jsx"; 
import { useState, useEffect, useRef } from "react";
import { LogOut, Sun, Moon, User, Settings as SettingsIcon, MoreVertical } from "lucide-react"; 
// Removed Scale and Lock icons as they are no longer needed in the dropdown

export default function Navbar() {
    const { user, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme(); 
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const menuRef = useRef(null); 

    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Tasks", path: "/tasks" },
        { name: "Profile", path: "/profile" },
        { name: "About", path: "/about" }, 
        // ADDED Terms and Privacy to the main navigation array
        { name: "Terms", path: "/terms" }, 
        { name: "Privacy", path: "/privacy" }, 
    ];

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
                
                <Link
                    to="/"
                    className="flex items-center space-x-2 text-2xl font-extrabold text-green-600 dark:text-green-400 tracking-tight absolute left-6 top-1/2 transform -translate-y-1/2"
                >
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>ErrandX</span>
                </Link>

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

                <div className="flex items-center gap-3 absolute right-6 top-1/2 transform -translate-y-1/2">
                    
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        aria-label="Toggle Dark Mode"
                    >
                        {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {user ? (
                        <div ref={menuRef} className="relative inline-block text-left">
                            
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none"
                                aria-label="User Menu"
                            >
                                <MoreVertical className="w-6 h-6" />
                            </button>

                            {isMenuOpen && (
                                <div 
                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none"
                                    role="menu" 
                                    aria-orientation="vertical" 
                                    aria-labelledby="menu-button"
                                >
                                    <div className="py-1 px-4">
                                        <div className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400 font-semibold truncate">
                                            <User className="inline-block w-4 h-4 mr-2 text-green-500" />
                                            {user.name}
                                        </div>
                                    </div>
                                    
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

                                        {/* REMOVED: Terms and Privacy links from the dropdown here */}

                                    </div>

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