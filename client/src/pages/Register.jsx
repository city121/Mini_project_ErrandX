import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth(); // Use 'register' function from AuthContext
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Use the register function from the AuthContext
    const registrationSuccessful = await register(name, email, password); 

    if (registrationSuccessful) {
      setSuccess(true);
      setTimeout(() => navigate("/tasks"), 1000);
    } 
    
    setLoading(false); // setLoading(false) should always happen regardless of success/failure
  };

  return (
    <div className="flex items-center justify-center min-h-screen 
                     bg-gray-100 dark:bg-gray-900 
                     text-gray-900 dark:text-gray-100 
                     transition-colors duration-300">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 
                        p-8 rounded-2xl shadow-lg w-full max-w-md 
                        border border-gray-200 dark:border-gray-700 
                        transition-colors duration-300"
          >
            <h2 className="text-3xl font-semibold text-center 
                            text-green-600 dark:text-green-400 mb-6">
              Create Your Account 🌱
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-700 
                              text-gray-900 dark:text-white 
                              placeholder-gray-500 dark:placeholder-gray-400 
                              focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-700 
                              text-gray-900 dark:text-white 
                              placeholder-gray-500 dark:placeholder-gray-400 
                              focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-700 
                              text-gray-900 dark:text-white 
                              placeholder-gray-500 dark:placeholder-gray-400 
                              focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-green-600 hover:bg-green-700 
                            text-white font-semibold py-3 rounded-lg 
                            transition-colors duration-300 disabled:opacity-70"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="text-sm text-center mt-5 text-gray-700 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 dark:text-green-400 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-white dark:bg-gray-800 
                        p-10 rounded-2xl shadow-lg text-center 
                        border border-gray-200 dark:border-gray-700
                        transition-colors duration-300"
          >
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              🌟 Registration Successful!
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Redirecting to your tasks...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}