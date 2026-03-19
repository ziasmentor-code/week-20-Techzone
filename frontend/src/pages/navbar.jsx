import { useState, useEffect } from "react";
import { User, ShoppingCart, Heart, Package, LogOut, Search, X, LayoutGrid } from "lucide-react"; // LayoutGrid added for Products icon
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from '../context/CartContext';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  // Safe cart count
  let cartCount = 0;
  try {
    const cartContext = useCart();
    cartCount = cartContext?.cartCount || 0;
  } catch (error) {
    console.log("Cart context not available yet");
  }

  useEffect(() => {
    // ⚠️ ബാക്കെൻഡിൽ 'access' എന്ന പേരിലാണ് ടോക്കൺ സേവ് ചെയ്യുന്നത്
    const token = localStorage.getItem("access"); 
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
      navigate(`/products?search=${searchQuery}`); // Redirect to products with search query
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-black text-white px-4 md:px-10 py-4 flex items-center justify-between z-50 shadow-2xl border-b border-white/10">
        
        {/* Logo */}
        <h1 
          className="text-2xl font-black tracking-tighter cursor-pointer text-[#00e676] hover:text-white transition-colors" 
          onClick={() => navigate("/")}
        >
          TECHZONE
        </h1>

        {/* Desktop Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-8 relative group"
        >
          <input 
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-12 outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] transition-all text-white placeholder-gray-400"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00e676]" size={18} />
          
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {/* Products Link - Added for easy navigation */}
          <button 
            onClick={() => navigate("/products")}
            className="hidden md:block text-xs font-bold uppercase tracking-widest hover:text-[#00e676] transition"
          >
            Products
          </button>

          <button 
            onClick={() => navigate("/cart")} 
            className="relative hover:text-[#00e676] transition group"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#00e676] text-black text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border border-black">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setOpen(true)} 
            className="flex items-center gap-2 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 hover:border-[#00e676] transition-all"
          >
            <User size={20} />
            <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Account</span>
          </button>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-20 bg-black"></div>

      {/* Sidebar Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* User Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-[#111] text-white z-[70] transform transition-transform duration-500 ease-in-out shadow-2xl ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-8 flex flex-col h-full">
          
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">{isLoggedIn ? "Account" : "Welcome"}</h2>
              <div className="h-1 w-10 bg-[#00e676] mt-1"></div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            {/* ⚠️ ഈ ലിങ്കാണ് നിങ്ങളെ പ്രോഡക്റ്റ് പേജിലേക്ക് കൊണ്ടുപോകുന്നത് */}
            <MenuLink 
              icon={<LayoutGrid size={20}/>} 
              label="Shop Products" 
              onClick={() => {
                navigate("/products"); 
                setOpen(false);
              }} 
            />

            {isLoggedIn ? (
              <>
                <MenuLink icon={<User size={20}/>} label="My Profile" onClick={() => { navigate("/profile"); setOpen(false); }} />
                <MenuLink icon={<Package size={20}/>} label="My Orders" onClick={() => { navigate("/my-orders"); setOpen(false); }} />
                <MenuLink icon={<Heart size={20}/>} label="Wishlist" onClick={() => { navigate("/wishlist"); setOpen(false); }} />
                
                <div className="pt-8 mt-8 border-t border-white/10">
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition font-bold">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-6 text-sm">Login to explore our tech collection.</p>
                <button 
                  onClick={() => { navigate("/login"); setOpen(false); }}
                  className="w-full bg-[#00e676] text-black font-black py-4 rounded-2xl hover:bg-white transition-all shadow-lg uppercase tracking-widest text-xs"
                >
                  Login / Register
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-gray-600 tracking-[0.2em] uppercase pt-6">
            © TechZone 2026
          </div>
        </div>
      </div>
    </>
  );
}

function MenuLink({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all group"
    >
      <span className="text-gray-400 group-hover:text-[#00e676] transition-colors">{icon}</span>
      <span className="font-bold tracking-tight text-gray-200 group-hover:text-white">{label}</span>
    </button>
  );
}

export default Navbar;