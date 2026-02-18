import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  LayoutDashboard, Package, ShoppingCart, LogOut, DollarSign, Trash2
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const logout = () => {
    localStorage.clear();
    window.location.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-gray-100 font-sans">
      <aside className="w-64 bg-[#1e293b] border-r border-white/5 flex flex-col fixed h-full">
        <div className="p-6">
          <h2 className="text-2xl font-black text-[#00e676] tracking-tighter italic">TECHZONE</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('Dashboard')} className={`nav-btn ${activeTab === 'Dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <button onClick={() => setActiveTab('Products')} className={`nav-btn ${activeTab === 'Products' ? 'active' : ''}`}>
            <Package size={20}/> Products
          </button>
          <button onClick={() => setActiveTab('Orders')} className={`nav-btn ${activeTab === 'Orders' ? 'active' : ''}`}>
            <ShoppingCart size={20}/> Orders
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="logout-btn"><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        {activeTab === 'Dashboard' && <DashboardView />}
        {activeTab === 'Products' && <ProductsView />}
        {activeTab === 'Orders' && <div className="text-center p-20 text-gray-500 italic">No Orders Yet...</div>}
      </main>

      <style>{`
        .nav-btn {
          display: flex; align-items: center; gap: 1rem; width: 100%; padding: 0.75rem 1rem;
          border-radius: 0.75rem; color: #94a3b8; transition: all 0.3s;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.05); color: white; }
        .nav-btn.active { background: #00e676; color: black; font-weight: bold; box-shadow: 0 0 15px rgba(0,230,118,0.2); }
        .logout-btn {
          display: flex; align-items: center; gap: 1rem; width: 100%; padding: 0.75rem 1rem;
          border-radius: 0.75rem; color: #f87171; transition: all 0.3s; font-weight: bold;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.1); }
      `}</style>
    </div>
  );
};

const DashboardView = () => {
  const [stats, setStats] = useState({ products: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/products/");
        setStats({
          products: res.data.length,
          revenue: 0 
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Overview</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl">
          <DollarSign className="text-[#00e676] mb-4" />
          <p className="text-gray-400 text-sm">Revenue</p>
          <h3 className="text-2xl font-bold">₹{stats.revenue}</h3>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl">
          <Package className="text-blue-500 mb-4" />
          <p className="text-gray-400 text-sm">Total Products</p>
          <h3 className="text-2xl font-bold">{stats.products}</h3>
        </div>
      </div>
    </div>
  );
};

const ProductsView = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  const loadData = async () => {
    try {
      const prodRes = await API.get("/products/");
      setAllProducts(prodRes.data);
      const catRes = await API.get("/products/categories/"); 
      setCategories(catRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // അപ്‌ഡേറ്റ് ചെയ്ത handleAddProduct ഫംഗ്‌ഷൻ
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return alert("Please select a category!");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", selectedCategory);
    if (image) formData.append("image", image);

    try {
      // 415 error ഒഴിവാക്കാൻ headers ചേർത്തു
      await API.post("/products/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Product Added! ✅");
      setName(""); setPrice(""); setDescription(""); setSelectedCategory(""); setImage(null);
      loadData();
    } catch (err) {
      console.error("Add Product Error:", err.response?.data);
      alert("Error adding product! Check console.");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await API.delete(`/products/${id}/`);
        loadData();
      } catch (err) {
        alert("Delete failed!");
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="bg-[#1e293b] p-8 rounded-[2rem] space-y-5 max-w-lg border border-white/5 shadow-2xl">
          <input type="text" placeholder="Product Name" value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-4 bg-black/40 rounded-xl text-white outline-none border border-white/10 focus:border-[#00e676]" required />
          <textarea placeholder="Product Description" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full p-4 bg-black/40 rounded-xl text-white outline-none border border-white/10 focus:border-[#00e676] min-h-[100px]" required />
          
          <select className="w-full p-4 bg-black/40 rounded-xl text-white outline-none border border-white/10 focus:border-[#00e676]" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>

          <input type="number" placeholder="Price (₹)" value={price} onChange={(e)=>setPrice(e.target.value)} className="w-full p-4 bg-black/40 rounded-xl text-white outline-none border border-white/10 focus:border-[#00e676]" required />
          <input type="file" onChange={(e)=>setImage(e.target.files[0])} className="w-full p-3 bg-black/20 rounded-xl text-sm text-gray-400 border border-dashed border-white/10" required />

          <button type="submit" className="w-full bg-[#00e676] text-black font-black py-4 rounded-2xl hover:scale-[1.02] transition-all uppercase tracking-wider">Save Product</button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-white">Manage Products</h2>
        <div className="bg-[#1e293b] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-[#00e676] uppercase text-xs font-bold">
              <tr>
                <th className="p-5">Product</th>
                <th className="p-5">Price</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 flex items-center gap-4">
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl bg-black/40">
                      <img 
                        src={
                          product?.image
                            ? product.image.startsWith('http')
                              ? product.image
                              : `http://127.0.0.1:8000${product.image}`
                            : "https://placehold.co/300x300?text=No+Image"
                        }
                        alt={product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="p-5 font-bold text-[#00e676]">₹{product.price}</td>
                  <td className="p-5 text-center">
                    <button onClick={() => deleteProduct(product.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;