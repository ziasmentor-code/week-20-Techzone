import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

import Navbar from "./pages/Navbar.jsx";
import Home from "./pages/home.jsx";
import Products from "./pages/product.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/register.jsx";
import OrderSuccess from './pages/OrderSuccess';
import Order from "./pages/Order.jsx"; 
import Checkout from "./pages/Checkout.jsx";
import AdminDashboard from './pages/AdminDashboard.jsx';
import OrderDetails from "./pages/OrderDetails.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

// Navbar നിയന്ത്രിക്കാനുള്ള Layout കമ്പോണന്റ്
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // URL '/admin' അല്ലെങ്കിൽ '/admin-login' എന്ന് തുടങ്ങുകയാണെങ്കിൽ Navbar കാണിക്കില്ല
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/admin-login';
  
  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
    </>
  );
};

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
          {/* Navbar നിയന്ത്രിക്കാൻ കമ്പോണന്റുകൾ AppLayout-നുള്ളിൽ നൽകുന്നു */}
          <AppLayout> 
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Products />} />
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

              {/* Admin Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />

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