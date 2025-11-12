import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Tasks from "./pages/Tasks.jsx";
import Profile from "./pages/Profile.jsx"; 
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";

// Import CreatorBadge here
import CreatorBadge from "./components/CreatorBadge.jsx"; 

import Settings from "./pages/Settings.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx"; 

import { useAuth } from "./context/AuthContext.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";

// Protected route (Unchanged)
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// Motion transition styles (shared for utility pages) (Unchanged)
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 },
};

export default function App() {
  const location = useLocation();
  const { darkMode } = useTheme();

  // Apply dark/light theme (Unchanged)
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    // CreatorBadge will now persist in this top-level container
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      
      {/* 🔝 Navbar */}
      <Navbar />

      {/* 🔔 Toast Notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />

      {/* 🔄 Page Transitions */}
      <main className="pt-20 px-4 sm:px-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* 🏠 Home */}
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-2xl shadow-lg transition-colors duration-500"
                >
                  <Home />
                </motion.div>
              }
            />

            {/* ℹ️ ABOUT PAGE (Public) */}
            <Route
              path="/about"
              element={
                <motion.div {...pageTransition}>
                  <About />
                </motion.div>
              }
            />

            {/* 📞 CONTACT PAGE (Public) */}
            <Route
              path="/contact"
              element={
                <motion.div {...pageTransition}>
                  <Contact />
                </motion.div>
              }
            />

            <Route
              path="/login"
              element={
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                  <Login />
                </motion.div>
              }
            />
            <Route
              path="/register"
              element={
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                  <Register />
                </motion.div>
              }
            />

            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Tasks />
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Profile />
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Settings />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/terms"
              element={
                <motion.div {...pageTransition}>
                  <Terms />
                </motion.div>
              }
            />

            <Route
              path="/privacy"
              element={
                <motion.div {...pageTransition}>
                  <Privacy />
                </motion.div>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <CreatorBadge /> 
      
    </div>
  );
}