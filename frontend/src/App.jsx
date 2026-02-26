import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { useState, useEffect } from "react";

// Public Pages
import Navbar from "./pages/Navbar.jsx";
import Home from "./pages/home.jsx";
import Products from "./pages/product.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import OrderSuccess from './pages/OrderSuccess';
import Order from "./pages/Order.jsx"; 
import Checkout from "./pages/Checkout.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";

// Admin Pages
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminCustomers from './pages/admin/AdminCustomers.jsx';

// Navbar control layout
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Admin pages-ൽ Navbar കാണിക്കണോ?
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/admin-login';
  
  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
    </>
  );
};

// 404 Page
function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-black text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <button 
        onClick={() => navigate('/')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <AppLayout>
            <Routes>
              {/* ===== ADMIN ROUTES (FIRST - HIGHEST PRIORITY) ===== */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/add" element={<AdminProducts />} />
              <Route path="/admin/products/edit/:id" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrders />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />

              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />}/>
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/my-orders" element={<Order />} /> 
              <Route path="/my-orders/:orderId" element={<OrderDetails />}/>
              <Route path="/track-order/:id" element={<TrackOrder />}/>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;