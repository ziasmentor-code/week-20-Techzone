import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use((req) => {
  // നിങ്ങളുടെ Login കമ്പോണന്റിൽ 'token' എന്ന പേരിൽ തന്നെയാണോ സേവ് ചെയ്യുന്നത് എന്ന് നോക്കുക
  const token = localStorage.getItem("token"); 
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

export default API;