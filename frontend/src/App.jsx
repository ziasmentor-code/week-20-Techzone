import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

// Public Pages - എല്ലാം വലിയ അക്ഷരത്തിൽ (Capitalized)
import Navbar from "./pages/Navbar.jsx";
import Home from "./pages/Home.jsx";              // 'H' വലിയ അക്ഷരം
import Products from "./pages/Product.jsx";       // 'P' വലിയ അക്ഷരം
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";              // 'C' വലിയ അക്ഷരം
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";             // 'L' വലിയ അക്ഷരം
import Register from "./pages/Register.jsx";       // 'R' വലിയ അക്ഷരം

// Admin Pages
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';

// --- Protected Route Logic ---
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!token || !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

// --- Layout Logic ---
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin') || 
                      location.pathname === '/admin-login' || 
                      location.pathname === '/admin-dashboard';
  
  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <AppLayout>
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} /> 
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* ===== ADMIN ROUTES ===== */}
              <Route path="/admin-login" element={<AdminLogin />} />
              
              <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin-dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              
              <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
              <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />

              {/* ===== 404 Page ===== */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                  <h1 className="text-5xl font-bold text-red-600">404</h1>
                  <p className="text-xl mt-4">Page Not Found</p>
                  <a href="/" className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">Go Home</a>
                </div>
              } />
            </Routes>
          </AppLayout>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;