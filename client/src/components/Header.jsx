import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <Link
        to="/tasks"
        className="text-2xl font-bold text-green-600 dark:text-green-400 tracking-tight"
      >
        ErrandX
      </Link>

      <nav className="flex items-center gap-6">
        <Link
          to="/tasks"
          className="text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          Tasks
        </Link>

        {user ? (
          <>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              👋 {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-green-500 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 dark:text-gray-300 hover:text-green-500 transition"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
