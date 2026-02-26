import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Package,
  Edit,
  Trash2,
  Plus,
  X,
} from "lucide-react";

const API = "http://127.0.0.1:8000";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState({
    total_revenue: 0,
    product_count: 0,
    order_count: 0,
  });

  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formDataState, setFormDataState] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const statsRes = await axios.get(`${API}/api/admin-stats/`);
      setStats({
        total_revenue: statsRes.data.total_revenue,
        product_count: statsRes.data.total_products,
        order_count: statsRes.data.total_orders,
      });

      const prodRes = await axios.get(`${API}/api/admin-products/`);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= ADD PRODUCT =================
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", formDataState.name);
    formData.append("price", formDataState.price);
    formData.append("stock", formDataState.stock);
    formData.append("description", formDataState.description || "");

    if (image) formData.append("image", image);

    try {
      await axios.post(`${API}/api/add-product/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product Added Successfully ✅");
      setShowAddModal(false);
      setFormDataState({
        name: "",
        price: "",
        stock: "",
        description: "",
      });
      setImage(null);
      fetchData();
    } catch (error) {
      console.error("ADD ERROR:", error.response?.data);
      alert(JSON.stringify(error.response?.data));
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await axios.delete(`${API}/api/delete-product/${id}/`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] fixed h-full p-6">
        <h2 className="text-2xl font-black text-[#00e676] mb-10 italic">
          TECHZONE
        </h2>

        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab("Dashboard")}
            className={`flex items-center gap-4 w-full p-3 rounded-xl ${
              activeTab === "Dashboard"
                ? "bg-[#00e676] text-black font-bold"
                : "text-gray-400"
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab("Products")}
            className={`flex items-center gap-4 w-full p-3 rounded-xl ${
              activeTab === "Products"
                ? "bg-[#00e676] text-black font-bold"
                : "text-gray-400"
            }`}
          >
            <Package size={20} /> Products
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="ml-64 p-10 w-full">
        <h1 className="text-4xl font-black mb-10">{activeTab}</h1>

        {/* DASHBOARD */}
        {activeTab === "Dashboard" && (
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard title="Total Revenue" value={`₹${stats.total_revenue}`} />
            <StatCard title="Total Products" value={stats.product_count} />
            <StatCard title="Total Orders" value={stats.order_count} />
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === "Products" && (
          <>
            <button
              onClick={() => setShowAddModal(true)}
              className="mb-6 bg-[#00e676] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Plus size={20} /> Add Product
            </button>

            <div className="bg-[#1e293b] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-white/5">
                      <td className="p-4">{product.name}</td>
                      <td className="p-4 text-[#00e676] font-bold">
                        ₹{product.price}
                      </td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4 text-center">
                        <Trash2
                          size={18}
                          onClick={() => handleDelete(product.id)}
                          className="cursor-pointer hover:text-red-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ADD PRODUCT MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#1e293b] p-8 rounded-2xl w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#00e676]">
                  Add Product
                </h2>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowAddModal(false)}
                />
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  className="w-full p-3 bg-[#0f172a] rounded-lg"
                  onChange={(e) =>
                    setFormDataState({
                      ...formDataState,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Price"
                  required
                  className="w-full p-3 bg-[#0f172a] rounded-lg"
                  onChange={(e) =>
                    setFormDataState({
                      ...formDataState,
                      price: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Stock"
                  required
                  className="w-full p-3 bg-[#0f172a] rounded-lg"
                  onChange={(e) =>
                    setFormDataState({
                      ...formDataState,
                      stock: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Description"
                  className="w-full p-3 bg-[#0f172a] rounded-lg"
                  onChange={(e) =>
                    setFormDataState({
                      ...formDataState,
                      description: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />

                <button
                  type="submit"
                  className="w-full bg-[#00e676] text-black font-bold p-3 rounded-lg"
                >
                  Save Product
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-[#1e293b] p-8 rounded-2xl">
    <h3 className="text-gray-400 mb-2">{title}</h3>
    <p className="text-3xl font-black text-[#00e676]">{value}</p>
  </div>
);

export default AdminDashboard;