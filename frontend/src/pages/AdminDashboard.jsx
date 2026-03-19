import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // UPDATED: Changed 'token' to 'access' to match your Login/Products logic
    const token = localStorage.getItem('access');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!token || !isAdmin) {
      navigate('/admin-login');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await API.get('/admin-stats/', {
        headers: {
          // ADDED: Explicit Authorization header for the stats request
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/admin-login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-500 flex items-center justify-center font-mono uppercase tracking-widest">
        Initializing System...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Dashboard Header */}
      <header className="mb-12 border-l-4 border-green-500 pl-6">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Administrative Control Panel</p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Inventory" value={stats.totalProducts} label="Units" />
        <StatCard title="Total Orders" value={stats.totalOrders} label="Processed" />
        <StatCard title="Customers" value={stats.totalCustomers} label="Active Users" />
        <StatCard 
          title="Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          label="Total Earnings" 
          highlight 
        />
      </div>

      {/* Management Quick Links */}
      <h2 className="text-gray-500 text-xs font-bold uppercase mb-6 tracking-widest">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionButton 
          label="Manage Products" 
          sub="Add, Edit, or Delete"
          color="border-green-500"
          onClick={() => navigate('/admin/products')} 
        />
        <ActionButton 
          label="Categories" 
          sub="Organize Inventory"
          color="border-blue-500"
          onClick={() => navigate('/admin/categories')} 
        />
        <ActionButton 
          label="Order Log" 
          sub="Shipment Tracking"
          color="border-purple-500"
          onClick={() => navigate('/admin/orders')} 
        />
      </div>
    </div>
  );
}

// Sub-component for Stats to keep code clean
const StatCard = ({ title, value, label, highlight }) => (
  <div className="bg-[#111] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
    <p className={`text-3xl font-black ${highlight ? 'text-green-500' : 'text-white'}`}>{value}</p>
    <p className="text-gray-600 text-[10px] uppercase mt-2 italic">{label}</p>
  </div>
);

// Sub-component for Buttons
const ActionButton = ({ label, sub, color, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-[#111] text-left p-6 rounded-xl border-b-4 ${color} hover:bg-[#1a1a1a] transition-all transform hover:-translate-y-1`}
  >
    <span className="block text-lg font-bold text-white">{label}</span>
    <span className="text-gray-500 text-xs uppercase tracking-tighter">{sub}</span>
  </button>
);