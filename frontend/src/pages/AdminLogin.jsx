import { useState } from "react";
import API from "../api/axios";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await API.post("/token/", { username, password });

    // 1. Clear any old session data (User or previous Admin)
    localStorage.clear();

    // 2. Save new Admin data
    localStorage.setItem("token", res.data.access);
    localStorage.setItem("isAdmin", "true"); 

    alert("Access Granted. Welcome, Admin! ✅");

    // 3. Force a redirect to the dashboard
    window.location.assign("/admin/dashboard");
    
  } catch (err) {
    // Check if the error is due to unauthorized access
    if (err.response && err.response.status === 403) {
      setError("Forbidden: You do not have Admin privileges! ❌");
    } else {
      setError("Invalid Admin ID or Passkey! ❌");
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-[#111] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-black text-center mb-8 text-[#00e676] tracking-tighter uppercase italic">
          Admin Access Only
        </h2>
        
        {error && (
          <p className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm mb-6 text-center font-bold border border-red-500/20">
            {error}
          </p>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5 text-white">
          <input
            type="text" placeholder="Admin ID"
            value={username} onChange={(e) => setUsername(e.target.value)} required
            className="w-full bg-white/5 px-6 py-4 border border-white/10 rounded-2xl focus:border-[#00e676] outline-none transition-all"
          />
          <input
            type="password" placeholder="Passkey"
            value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full bg-white/5 px-6 py-4 border border-white/10 rounded-2xl focus:border-[#00e676] outline-none transition-all"
          />
          <button type="submit" className="w-full bg-[#00e676] text-black py-4 rounded-2xl font-black hover:bg-white transition-all shadow-[0_0_20px_rgba(0,230,118,0.3)]">
            LOGIN AS ADMIN
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;