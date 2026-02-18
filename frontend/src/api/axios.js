import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // തൽക്കാലം റീഡയറക്ഷൻ ഒഴിവാക്കുന്നു (പ്രശ്നം കണ്ടുപിടിക്കാൻ)
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized! Token invalid or expired.");
    }
    return Promise.reject(error);
  }
);

// ഇതാവാം നിങ്ങൾ വിട്ടുപോയത്, ഇത് കൃത്യമായി ഉണ്ടെന്ന് ഉറപ്പാക്കുക
export default API;