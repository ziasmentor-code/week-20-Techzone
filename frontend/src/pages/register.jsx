import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react"; 

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.password2) {
      setError("Passwords do not match!");
      return;
    }


    const dataToSend = {
      username: form.username,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      password: form.password,
      password2: form.password2 
    };

    try {
      const response = await API.post("/users/register/", dataToSend);
      console.log("SUCCESS ✅", response.data);
      setSuccess("Registration successful! Redirecting to login...");
      
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const backendErrors = err.response?.data;
      console.log("FULL ERROR DETAILS:", backendErrors);

      if (backendErrors) {

        const messages = Object.keys(backendErrors).map(key => {
          return `${key}: ${backendErrors[key].join(", ")}`;
        });
        setError(messages.join(" | "));
      } else {
        setError("Something went wrong. Please check your connection.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00e676]/10 rounded-3xl mb-4 border border-[#00e676]/20">
            <UserPlus className="text-[#00e676]" size={38} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Create Account</h2>
          <p className="text-gray-400 mt-2 font-medium">Join Techzone today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Inputs Group */}
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00e676] transition-colors" size={18} />
              <input 
                name="username" 
                placeholder="Username" 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-12 text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676]/50 outline-none transition-all placeholder:text-gray-600"
                required 
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00e676] transition-colors" size={18} />
              <input 
                type="email"
                name="email" 
                placeholder="Email Address" 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-12 text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676]/50 outline-none transition-all placeholder:text-gray-600"
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input 
                name="first_name" 
                placeholder="First Name" 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-[#00e676] outline-none transition-all placeholder:text-gray-600"
              />
              <input 
                name="last_name" 
                placeholder="Last Name" 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-[#00e676] outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00e676] transition-colors" size={18} />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-12 text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676]/50 outline-none transition-all placeholder:text-gray-600"
                required 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00e676] transition-colors" size={18} />
              <input 
                type="password" 
                name="password2" 
                placeholder="Confirm Password" 
                onChange={handleChange} 
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-12 text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676]/50 outline-none transition-all placeholder:text-gray-600"
                required 
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="text-red-400 text-xs bg-red-400/10 p-4 rounded-xl border border-red-400/20 animate-in fade-in slide-in-from-top-1">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
          {success && (
            <div className="text-[#00e676] text-sm bg-[#00e676]/10 p-4 rounded-xl border border-[#00e676]/20 animate-in zoom-in-95">
              {success}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-[#00e676] hover:bg-white text-black font-black py-5 rounded-2xl transition-all duration-500 transform active:scale-95 shadow-[0_10px_30px_rgba(0,230,118,0.2)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] mt-4 uppercase tracking-widest text-sm"
          >
            Register Now
          </button>
        </form>

        <p className="text-center text-gray-500 mt-10 text-sm font-medium">
          Already have an account?{" "}
          <button 
            onClick={() => navigate("/login")}
            className="text-[#00e676] font-extrabold hover:text-white ml-1 transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;