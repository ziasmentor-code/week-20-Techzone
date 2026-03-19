import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // പ്രധാന മാറ്റം: ബാക്കെൻഡിലെ നിങ്ങളുടെ urls.py ഫയലിലെ പാത്ത് ഇതാണോ എന്ന് ഉറപ്പാക്കുക.
      // മിക്കവാറും ഇത് "http://127.0.0.1:8000/api/login/" അല്ലെങ്കിൽ 
      // "http://127.0.0.1:8000/login/" ആയിരിക്കും.
      const response = await axios.post("http://127.0.0.1:8000/api/admin-dashboard/login/", {
        username: username,
        password: password,
      });

      if (response.status === 200 || response.status === 201) {
        // ടോക്കൺ ഉണ്ടെങ്കിൽ സൂക്ഷിക്കുന്നു
        const token = response.data.access || response.data.token;
        if (token) localStorage.setItem("authToken", token);
        
        navigate("/admin-dashboard");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMsg("ബാക്കെൻഡിൽ ഈ URL (Route) നിലവിലില്ല. നിങ്ങളുടെ urls.py പരിശോധിക്കുക.");
      } else {
        setErrorMsg("Invalid Credentials ❌");
      }
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Admin Login</h2>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 active:scale-95 transition-all shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-green-600 font-bold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;