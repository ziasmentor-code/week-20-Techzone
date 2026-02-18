import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

// Pages imports (filenames small letters, component names capitalized)
import Navbar from './pages/navbar.jsx';
import Products from './pages/products.jsx';
import ProductDetail from './pages/productdetail.jsx';
import Cart from './pages/cart.jsx';
import Wishlist from './pages/wishlist.jsx';
import Login from './pages/login.jsx';

// 404 Component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/products"
          className="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Go to Products
        </Link>
      </div>
    </div>
  );
}

// Home redirect
function Home() {
  return <Navigate to="/products" replace />;
}

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
