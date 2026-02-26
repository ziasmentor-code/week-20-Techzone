import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. JWT token ലഭിക്കാനായി 'token/' എൻഡ്‌പോയിന്റിലേക്ക് അയക്കുന്നു
      // baseURL-ൽ /api/ ഉള്ളതുകൊണ്ട് ഇവിടെ 'token/' എന്ന് മാത്രം മതി
      const response = await API.post('token/', credentials);
      
      // 2. JWT സാധാരണയായി access, refresh ടോക്കണുകളാണ് നൽകുന്നത്
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // യൂസർ അഡ്മിൻ ആണോ എന്ന് പരിശോധിക്കാൻ ലളിതമായ ഒരു ഒബ്ജക്റ്റ് സേവ് ചെയ്യുന്നു
        const userObj = { 
          username: credentials.username, 
          is_admin: true // ലോഗിൻ വിജയിച്ചാൽ അഡ്മിൻ ആയി കണക്കാക്കാം
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        
        // വിജയകരമായി ലോഗിൻ ചെയ്താൽ അഡ്മിൻ ഡാഷ്‌ബോർഡിലേക്ക്
        navigate('/admin');
      }
      
    } catch (error) {
      console.error('Login Error:', error);
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.status === 404) {
        setError('Login API not found. Please check backend URLs.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">TECHRONE Admin</h2>
        <p className="text-center text-gray-500 mb-6 font-medium">Admin Portal Login</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Admin username"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Admin password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;