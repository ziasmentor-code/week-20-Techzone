import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ലോഗിൻ പേജിൽ വരുമ്പോൾ ടോക്കൺ ഉണ്ടോ എന്ന് നോക്കുക
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        // ടോക്കൺ ഉണ്ടെങ്കിൽ ലോഗിൻ പേജിൽ നിൽക്കാതെ പ്രോഡക്റ്റ് പേജിലേക്ക് വിടാം
        navigate('/products');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/token/', formData);

      if (response.data && response.data.access) {
        // 1. ടോക്കൺ സേവ് ചെയ്യുക
        localStorage.setItem('token', response.data.access);
        
        // 2. Axios ഹെഡറിലേക്ക് ടോക്കൺ ഇൻസ്റ്റന്റ് ആയി ചേർക്കുക
        API.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        console.log("Login Success: Token Saved ✅");
        
        // 3. പേജ് റീഡയറക്ട് ചെയ്യുക
        // ഇവിടെ window.location.href ഉപയോഗിക്കുന്നത് സ്റ്റേറ്റ് കൃത്യമായി അപ്‌ഡേറ്റ് ആകാൻ സഹായിക്കും
        window.location.href = '/products'; 
        
      } else {
        setError("Invalid response from server.");
      }

    } catch (err) {
      console.error("Login Error Details:", err.response?.data);
      const errorMessage = err.response?.data?.detail || 'Invalid username or password.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center mb-2 tracking-tighter">TECHZONE</h1>
        <p className="text-center text-gray-500 mb-8">Please enter your details</p>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all transform active:scale-95 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">New here?</span></div>
        </div>

        <p className="text-center text-sm">
          <Link to="/register" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

0