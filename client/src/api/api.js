import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

// Interceptor to inject the token into requests for protected routes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If the request data is FormData (for file upload), remove the default Content-Type header
    // so the browser can automatically set it to 'multipart/form-data' with the correct boundary.
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API Calls ---

// Auth
export const loginUser = (email, password) => {
  return apiClient.post("/auth/login", { email, password });
};

export const registerUser = (name, email, password) => {
  return apiClient.post("/auth/register", { name, email, password });
};

// Users
export const updateUserApi = (userId, updatedData) => {
  return apiClient.put(`/users/${userId}`, updatedData);
};

// CRITICAL FIX: Add the API call for FILE UPLOAD
export const uploadProfilePictureApi = (userId, formData) => {
    // This POST endpoint handles the raw file data
    return apiClient.post(`/users/${userId}/upload-photo`, formData); 
};


// Tasks
export const fetchTasks = () => apiClient.get("/tasks").then(res => res.data);

export const createTask = (taskData) => apiClient.post("/tasks", taskData).then(res => res.data);

export const updateTask = (taskId, updatedData) => apiClient.put(`/tasks/${taskId}`, updatedData).then(res => res.data);

export const deleteTask = (taskId) => apiClient.delete(`/tasks/${taskId}`).then(res => res.data);

export const claimTask = (taskId, userId) => apiClient.put(`/tasks/${taskId}/claim`, { claimedBy: userId }).then(res => res.data);

export const unclaimTask = (taskId) => apiClient.put(`/tasks/${taskId}/unclaim`).then(res => res.data);