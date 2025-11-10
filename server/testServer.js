import fetch from "node-fetch";

const API_URL = "http://localhost:5000/api/tasks";

const test = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // If your API requires JWT, add it here:
        // "Authorization": "Bearer YOUR_JWT_HERE"
      },
    });

    const data = await res.json();
    console.log("Response status:", res.status);
    console.log("Response body:", data);
  } catch (err) {
    console.error("Error connecting to backend:", err.message);
  }
};

test();
