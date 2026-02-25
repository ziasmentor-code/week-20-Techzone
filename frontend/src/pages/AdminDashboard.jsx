import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Package, ShoppingCart, LogOut, DollarSign, Edit, Trash2, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState({ total_revenue: 0, product_count: 0, order_count: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Stats
        const statsRes = await axios.get('http://localhost:8000/api/admin-stats/');
        setStats({
          total_revenue: statsRes.data.total_revenue,
          product_count: statsRes.data.products_count,
          order_count: statsRes.data.orders_count
        });

        // 2. Fetch Product List
        const prodRes = await axios.get('http://localhost:8000/api/admin-products/');
        setProducts(prodRes.data);

        // 3. Fetch Order List
        const orderRes = await axios.get('http://localhost:8000/api/admin-orders/');
        setOrders(orderRes.data);

      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] fixed h-full p-6 border-r border-white/5">
        <h2 className="text-2xl font-black text-[#00e676] mb-10 italic">TECHZONE</h2>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('Dashboard')} className={`flex items-center gap-4 w-full p-3 rounded-xl ${activeTab === 'Dashboard' ? 'bg-[#00e676] text-black font-bold' : 'text-gray-400'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('Products')} className={`flex items-center gap-4 w-full p-3 rounded-xl ${activeTab === 'Products' ? 'bg-[#00e676] text-black font-bold' : 'text-gray-400'}`}>
            <Package size={20} /> Products
          </button>
          <button onClick={() => setActiveTab('Orders')} className={`flex items-center gap-4 w-full p-3 rounded-xl ${activeTab === 'Orders' ? 'bg-[#00e676] text-black font-bold' : 'text-gray-400'}`}>
            <ShoppingCart size={20} /> Orders
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="ml-64 p-10 w-full">
        <h1 className="text-4xl font-black mb-10">{activeTab}</h1>

        {/* Dashboard View */}
        {activeTab === 'Dashboard' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-sm">Revenue</p>
                <h3 className="text-3xl font-bold">₹{Number(stats.total_revenue).toLocaleString()}</h3>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-sm">Products</p>
                <h3 className="text-3xl font-bold">{stats.product_count}</h3>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-sm">Orders</p>
                <h3 className="text-3xl font-bold">{stats.order_count}</h3>
            </div>
          </div>
        )}

        {/* Products Table View */}
        {activeTab === 'Products' && (
          <div className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-white/5">
              <h2 className="font-bold text-xl text-[#00e676]">Inventory</h2>
              <button className="bg-[#00e676] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={18}/> Add</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-semibold">{product.name}</td>
                    <td className="p-4 text-green-400">₹{product.price}</td>
                    <td className="p-4">{product.stock} units</td>
                    <td className="p-4 flex gap-3 text-gray-400">
                      <Edit size={18} className="hover:text-blue-400 cursor-pointer"/>
                      <Trash2 size={18} className="hover:text-red-400 cursor-pointer"/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;