import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

function AdminProductList() {
  const [products, setProducts] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("products/");
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error(error.response || error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`products/${id}/`);
      toast.success("Product deleted");
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Products List</h2>
          <Link
            to="/admin/products/add"
            className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Add Product
          </Link>
        </div>

        <div className="grid gap-4">
          {products.length > 0 ? (
            products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-gray-600">${p.price}</p>
                </div>
                <div className="flex gap-4">
                  <Link
                    to={`/admin/products/edit/${p.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-6">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProductList;
