import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// ഓരോ റിക്വസ്റ്റ് അയക്കുമ്പോഴും LocalStorage-ൽ നിന്ന് ടോക്കൺ എടുത്ത് ചേർക്കും
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // നിങ്ങളുടെ ടോക്കൺ കീ ഇവിടെ നൽകുക
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;