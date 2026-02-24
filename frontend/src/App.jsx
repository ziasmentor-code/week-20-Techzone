import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

import Navbar from "./pages/Navbar.jsx";
import Home from "./pages/home.jsx";
import Products from "./pages/product.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/register.jsx";
import OrderSuccess from './pages/OrderSuccess';
import Order from "./pages/Order.jsx"; 
import Checkout from "./pages/Checkout.jsx";
import AdminDashboard from './pages/AdminDashboard';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">404 - Page Not Found</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* ✅ രണ്ട് പാത്തുകളും (product & products) ഇവിടെ നൽകുന്നു */}
            <Route path="/product" element={<Products />} />
            <Route path="/products" element={<Products />} />
            
            <Route path="/product/:productId" element={<ProductDetail />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />}/>
            <Route path="/order-success" element={<OrderSuccess />} />
            
            <Route path="/my-orders" element={<Order />} /> 
            <Route path="/admin" element={<AdminDashboard />} />

            {/* ❌ NotFound എപ്പോഴും അവസാനം മാത്രം */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;