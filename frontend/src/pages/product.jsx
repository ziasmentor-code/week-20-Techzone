import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link കൂടി ഇമ്പോർട്ട് ചെയ്തു
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

const getImage = (img) =>
  !img ? 'https://placehold.co/400x320/f8fafc/cbd5e1?text=No+Image'
       : img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`;

const rupees = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

/* ─────────────────────────────────────────
    PRODUCT CARD Component
───────────────────────────────────────── */
function GridCard({ product, wishlisted, onWishlist, onAddCart, added }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5">
      {/* Image-ൽ ക്ലിക്ക് ചെയ്താൽ ഡീറ്റൈൽ പേജിലേക്ക് പോകാൻ Link നൽകി */}
      <Link to={`/product/${product.id}`} className="relative h-48 bg-slate-50 overflow-hidden block">
        <img src={getImage(product.image)} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </Link>

      <button 
        onClick={() => onWishlist(product.id)} 
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 transition-all ${wishlisted ? 'bg-rose-500 text-white' : 'bg-white text-slate-400'}`}
      >
        <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <div className="p-4 flex flex-col flex-1">
        {/* Name-ൽ ക്ലിക്ക് ചെയ്താലും ഡീറ്റൈൽ പേജിലേക്ക് പോകാം */}
        <Link to={`/product/${product.id}`}>
           <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-2 hover:text-[#00e676] transition-colors">
             {product.name}
           </h3>
        </Link>
        
        <span className="text-lg font-black text-slate-900 mb-4">{rupees(product.price)}</span>
        
        <button
          onClick={() => onAddCart(product)}
          className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl transition-all ${added ? 'bg-emerald-500 text-white' : 'bg-black text-white hover:bg-[#00e676] hover:text-black'}`}
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
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [wishlist, setWishlist] = useState([]);
  const [cartAdded, setCartAdded] = useState([]);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await API.get('/products/', {
          headers: { Authorization: `Token ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [navigate]);

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
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === cat.id ? 'bg-black text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full outline-none text-sm focus:ring-2 ring-[#00e676]/20"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400">Loading Products...</div>
        ) : (
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
        )}
      </div>
    </div>
  );
}