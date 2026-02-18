import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom"; // useNavigate ഇമ്പോർട്ട് ചെയ്യുക

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // നാവിഗേഷൻ ഫംഗ്ഷൻ ഡിക്ലയർ ചെയ്യുക

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/token/", { username, password });

      localStorage.clear();
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("Login Successful ✅");
      window.location.replace("/"); 
      
    } catch (err) {
      setError("Invalid username or password ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-black text-center mb-8 tracking-tighter text-black">LOGIN</h2>
        {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-bold">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-5 text-black">
          <input
            type="text" placeholder="Username"
            value={username} onChange={(e) => setUsername(e.target.value)} required
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <input
            type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">
            CONTINUE
          </button>
        </form>

        {/* പുതിയ രജിസ്റ്റർ ഓപ്ഷൻ താഴെ ചേർക്കുന്നു */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 font-medium">
            Don't have an account? 
            <button 
              onClick={() => navigate("/register")} 
              className="ml-2 text-blue-600 font-bold hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;