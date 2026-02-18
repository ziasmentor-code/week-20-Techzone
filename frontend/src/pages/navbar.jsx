import { useState, useEffect } from "react";
import { User, ShoppingCart, Heart, Package, LogOut, Search, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setOpen(false);
    navigate("/login");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <>
      {/* --- Main Navigation --- */}
      <nav className="fixed top-0 left-0 w-full bg-black text-white px-4 md:px-10 py-4 flex items-center justify-between z-50 shadow-2xl border-b border-white/10">
        
        {/* Logo */}
        <h1 
          className="text-2xl font-black tracking-tighter cursor-pointer text-[#00e676]" 
          onClick={() => navigate("/")}
        >
          TECHZONE
        </h1>

        {/* --- Search Bar --- */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-8 relative group"
        >
          <input 
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-12 outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00e676]" size={18} />
        </form>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button className="md:hidden text-gray-400">
            <Search size={22} />
          </button>
          
          <button onClick={() => navigate("/cart")} className="relative hover:text-[#00e676] transition">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-[#00e676] text-black text-[10px] font-bold px-1.5 rounded-full">0</span>
          </button>

          <button 
            onClick={() => setOpen(true)} 
            className="flex items-center gap-2 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 transition"
          >
            <User size={20} />
            <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Account</span>
          </button>
        </div>
      </nav>

      <div className="h-20 bg-black"></div>

      {/* --- Sidebar Overlay --- */}
      {open && <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md" onClick={() => setOpen(false)} />}

      {/* --- User Sidebar --- */}
      <div className={`fixed top-0 right-0 h-full w-85 bg-[#111] text-white z-[70] transform transition-transform duration-500 ease-in-out shadow-2xl ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-8 flex flex-col h-full">
          
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black tracking-tighter">MY ACCOUNT</h2>
              <div className="h-1 w-10 bg-[#00e676] mt-1"></div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition">
              <X size={24} />
            </button>
          </div>

          {/* Menu Options */}
          <div className="flex-1 space-y-2">
            {isLoggedIn ? (
              <>
                <MenuLink icon={<User size={20}/>} label="My Profile" onClick={() => {navigate("/profile"); setOpen(false);}} />
                <MenuLink icon={<Package size={20}/>} label="My Orders" onClick={() => {navigate("/orders"); setOpen(false);}} />
                <MenuLink icon={<Heart size={20}/>} label="Wishlist" onClick={() => {navigate("/wishlist"); setOpen(false);}} />
                
                <div className="pt-8 mt-8 border-t border-white/10">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition font-bold"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-6">Login to manage your orders and profile.</p>
                <button 
                  onClick={() => {navigate("/login"); setOpen(false);}}
                  className="w-full bg-[#00e676] text-black font-black py-4 rounded-2xl hover:bg-white transition-all shadow-lg uppercase tracking-widest text-sm"
                >
                  Login / Register
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-gray-600 tracking-[0.2em] uppercase">
            © TechZone 2026
          </div>
        </div>
      </div>
    </>
  );
}

// Sidebar Menu Link Component
function MenuLink({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group"
    >
      <span className="text-gray-400 group-hover:text-[#00e676] transition-colors">{icon}</span>
      <span className="font-bold tracking-tight text-gray-200">{label}</span>
    </button>
  );
}

export default Navbar;