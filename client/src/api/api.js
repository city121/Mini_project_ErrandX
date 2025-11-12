import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const loginUser = (email, password) => {
  return apiClient.post("/auth/login", { email, password });
};

export const registerUser = (name, email, password) => {
  return apiClient.post("/auth/register", { name, email, password });
};

export const updateUserApi = (userId, updatedData) => {
  return apiClient.put(`/users/${userId}`, updatedData);
};

export const uploadProfilePictureApi = (userId, formData) => {
  return apiClient.post(`/users/${userId}/upload-photo`, formData); 
};


export const fetchTasks = () => apiClient.get("/tasks").then(res => res.data);

export const createTask = (taskData) => apiClient.post("/tasks", taskData).then(res => res.data);

export const updateTask = (taskId, updatedData) => apiClient.put(`/tasks/${taskId}`, updatedData).then(res => res.data);

export const deleteTask = (taskId) => apiClient.delete(`/tasks/${taskId}`).then(res => res.data);

export const claimTask = (taskId) => apiClient.put(`/tasks/${taskId}/claim`).then(res => res.data);

export const unclaimTask = (taskId) => apiClient.put(`/tasks/${taskId}/unclaim`).then(res => res.data);