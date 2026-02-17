import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

API.interceptors.request.use((req) => {
  // ❌ Do NOT attach token for auth-free routes
  const authFreeUrls = [
    "/users/register/",
    "/users/login/",
    "/token/",
  ];

  const isAuthFree = authFreeUrls.some((url) =>
    req.url.includes(url)
  );

  if (!isAuthFree) {
    const token = localStorage.getItem("access");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }

  return req;
});

export default API;
