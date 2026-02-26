import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import {
  ShoppingCart, Star, Search, Heart, Smartphone, Laptop,
  Watch, Tv, CheckCircle2
} from 'lucide-react';

/* ─────────────────────────────────────────
    HELPERS
───────────────────────────────────────── */
const CATEGORIES = [
  { id: 'all',    label: 'All',      icon: null },
  { id: 'phone',  label: 'Phones',   icon: <Smartphone size={15}/> },
  { id: 'laptop', label: 'Laptops',  icon: <Laptop size={15}/> },
  { id: 'watch',  label: 'Watches',  icon: <Watch size={15}/> },
  { id: 'tv',     label: 'TVs',      icon: <Tv size={15}/> },
];

const detectCategory = (p) => {
  const t = `${p.name} ${p.description} ${p.category || ''}`.toLowerCase();
  if (/phone|mobile|iphone|samsung|smartphone/.test(t)) return 'phone';
  if (/laptop|macbook|notebook/.test(t)) return 'laptop';
  if (/watch|smartwatch/.test(t)) return 'watch';
  if (/tv|television/.test(t)) return 'tv';
  return 'other';
};

const getImage = (img) => {
  if (!img) return 'https://placehold.co/400x320/f8fafc/cbd5e1?text=No+Image';
  if (img.startsWith('http')) return img;
  return `http://localhost:8000${img}`;
};

const rupees = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

/* ─────────────────────────────────────────
    PRODUCT CARD Component
───────────────────────────────────────── */
function GridCard({ product, wishlisted, onWishlist, onAddCart, added }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
      {/* Image link to detail page */}
      <Link to={`/product/${product.id}`} className="relative h-48 bg-slate-50 overflow-hidden block">
        <img 
          src={getImage(product.image)} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x320/f8fafc/cbd5e1?text=No+Image';
          }}
        />
      </Link>

      <button 
        onClick={() => onWishlist(product.id)} 
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 transition-all ${
          wishlisted ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 hover:bg-rose-50'
        }`}
      >
        <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
           <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-2 hover:text-[#00e676] transition-colors">
             {product.name}
           </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-slate-400 ml-1">(24)</span>
        </div>
        
        <span className="text-lg font-black text-slate-900 mb-4">{rupees(product.price)}</span>
        
        <button
          onClick={() => onAddCart(product)}
          className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl transition-all ${
            added ? 'bg-emerald-500 text-white' : 'bg-black text-white hover:bg-[#00e676] hover:text-black'
          }`}
          disabled={added}
        >
          {added ? <><CheckCircle2 size={15} /> Added!</> : <><ShoppingCart size={15} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
    MAIN COMPONENT
───────────────────────────────────────── */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [wishlist, setWishlist] = useState([]);
  const [cartAdded, setCartAdded] = useState([]);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Token check
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Fetching products with token:', token.substring(0, 10) + '...');
      
      // API call - interceptor automatically adds token
      const response = await API.get('/products/');
      
      console.log('Products fetched:', response.data.length);
      setProducts(response.data);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view products.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if backend is running.');
      } else {
        setError(err.response?.data?.message || 'Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAddCart = (product) => {
    addToCart(product);
    setCartAdded(prev => [...prev, product.id]);
    setTimeout(() => {
      setCartAdded(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  // Filter and sort products
  const filtered = products
    .filter(p => activeTab === 'all' || detectCategory(p) === activeTab)
    .filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with filters */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTab === cat.id ? 'bg-black text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full outline-none text-sm focus:ring-2 ring-[#00e676]/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
            
            <select 
              className="px-3 py-2 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 ring-[#00e676]/20"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-[#00e676] mb-4"></div>
            <p className="font-bold text-slate-400">Loading Products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md mx-auto">
              <p className="font-bold mb-2">Error</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={fetchProducts}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 font-bold">No products found</p>
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="mt-4 text-[#00e676] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-4">{filtered.length} products found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <GridCard
                  key={product.id}
                  product={product}
                  wishlisted={wishlist.includes(product.id)}
                  onWishlist={toggleWishlist}
                  onAddCart={handleAddCart}
                  added={cartAdded.includes(product.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}