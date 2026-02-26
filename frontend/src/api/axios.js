import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// ഓരോ റിക്വസ്റ്റിലും ടോക്കൺ ഉണ്ടോ എന്ന് നോക്കി അത് Header-ൽ ചേർക്കുന്നു
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access'); // ലോഗിൻ ടോക്കൺ എടുക്കുന്നു
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;