import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <h2 className="text-white text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            <a href="/admin" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-700">
              Dashboard
            </a>
            <a href="/admin/products" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-700">
              Products
            </a>
            <a href="/admin/orders" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-700">
              Orders
            </a>
            <a href="/admin/categories" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-700">
              Categories
            </a>
            <a href="/admin/customers" className="block text-gray-300 hover:text-white py-2 px-4 rounded hover:bg-gray-700">
              Customers
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}