import { Link } from "react-router-dom";

function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Products</h3>
            <Link
              to="/admin/products/list"
              className="text-green-600 font-medium hover:underline"
            >
              Manage Products
            </Link>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Projects</h3>
            <Link
              to="/admin/projects/list"
              className="text-blue-600 font-medium hover:underline"
            >
              Manage Projects
            </Link>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
