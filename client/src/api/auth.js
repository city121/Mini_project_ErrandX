import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/auth" });

export const registerUser = async (data) => {
  const res = await API.post("/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await API.post("/login", data);
  return res.data;
};

export const getProfile = async (token) => {
  const res = await API.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
