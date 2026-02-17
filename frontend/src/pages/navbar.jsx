import { useState } from "react";
import { User, ShoppingCart, MapPin, Menu, Search } from "lucide-react";


function Navbar() {
  const [open, setOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <>
     
      <nav className="fixed top-0 left-0 w-full bg-black text-white px-6 py-5 flex items-center justify-between z-50 shadow-md">
        

        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold tracking-wide cursor-pointer">
            TechZone
          </h1>
{/* 
          <button className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition">
            <Menu size={20} />
            <span className="font-medium">Menu</span>
          </button> */}
        </div>

        {/* SEARCH */}
        <div className="flex-1 mx-12 relative hidden md:block">
          <div className="relative group">
            <Search
              size={20}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer group-hover:text-black transition"
            />
            <input
              type="text"
              placeholder="What are you looking for?"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full px-5 py-2.5 bg-white rounded text-black outline-none text-sm placeholder:text-gray-400 shadow-sm transition-all focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {isSearchFocused && (
            <div className="absolute top-[110%] left-0 w-full bg-[#1a1a1a] text-white p-5 rounded-md shadow-2xl z-50 border border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-xs font-bold mb-3 uppercase tracking-wider text-gray-500">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Iphone 17', 'Iphone 16', 'Laptop', 'Monitor', 'Washing Machine'].map((item) => (
                  <span 
                    key={item} 
                    className="text-xs bg-[#333] px-4 py-1.5 rounded-full cursor-pointer hover:bg-white hover:text-black transition-all duration-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1 text-sm opacity-80 cursor-pointer hover:opacity-100">
            <MapPin size={18} />
            <span>Kerala</span>
          </div>

          <div className="relative cursor-pointer group">
            <ShoppingCart size={24} className="group-hover:scale-110 transition" />
            <span className="absolute -top-2 -right-2 bg-green-500 text-[10px] font-bold px-1.5 rounded-full">0</span>
          </div>

          <button onClick={() => setOpen(true)} className="hover:scale-110 transition">
            <User size={24} />
          </button>
        </div>
      </nav>

      
      <div className="h-20 md:h-24 bg-black"></div>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-[60] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-black text-white z-[70] transform transition-transform duration-300 ease-in-out border-l border-gray-800 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <h2 className="text-xl font-bold italic">TechZone</h2>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>

          <ul className="space-y-5 text-md font-medium">
            <li className="hover:text-blue-400 transition cursor-pointer">My Profile</li>
            <li className="hover:text-blue-400 transition cursor-pointer">My Address</li>
            <li className="hover:text-blue-400 transition cursor-pointer">My Orders</li>
            <li className="hover:text-blue-400 transition cursor-pointer">Wishlist</li>
            <li className="hover:text-blue-400 transition cursor-pointer">Devices & Plans</li>
            <li className="hover:text-blue-400 transition cursor-pointer">Service Requests</li>
          </ul>

          <button
            className="w-full border border-red-500 text-red-500 py-3 rounded font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;