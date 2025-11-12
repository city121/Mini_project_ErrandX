import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { loginUser, registerUser, updateUserApi } from "../api/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Could not parse stored user data:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);
      const { user: userData, token } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);

      toast.success(`Login successful! Welcome back, ${userData.name}!`);
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Check server status.";
      toast.error(errorMessage);

      console.error("Login Error:", err);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await registerUser(name, email, password);
      const { user: userData, token } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);

      toast.success("Registration successful! Logging you in...");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed.";
      toast.error(errorMessage);
      console.error("Registration Error:", err);
      return false;
    }
  };
  const updateUser = async (updatedUserData) => {
    try {
      const res = await updateUserApi(updatedUserData._id, updatedUserData);
      const updatedUser = res.data.user; 

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return updatedUser;
    } catch (err) {
      console.error("Update User Error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Failed to update profile.");
    }
  };


  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);

    toast("Logged out successfully! 👋", {
      icon: "👋",
      duration: 1000,
    });
  };

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    updateUser, // Make sure updateUser is exposed
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};