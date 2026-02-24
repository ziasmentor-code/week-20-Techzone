import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // WishlistContext ഉണ്ടെന്ന് ഉറപ്പാക്കുക
import { ShoppingCart, ArrowLeft, Heart, Loader, Minus, Plus, Star } from 'lucide-react';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get(`/products/${productId}/`, {
        headers: token ? { Authorization: `Token ${token}` } : {}
      });
      setProduct(res.data);
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setAddingToCart(true);
    // ഒരേ പ്രൊഡക്റ്റ് ക്വാണ്ടിറ്റി അനുസരിച്ച് ആഡ് ചെയ്യാൻ
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setTimeout(() => setAddingToCart(false), 500);
  };

  const getImageUrl = (img) => {
    if (!img) return 'https://placehold.co/600x400/f8fafc/cbd5e1?text=No+Image';
    return img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-2 rounded-lg">
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-6 hover:text-black">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image Section */}
          <div className="relative bg-gray-50 rounded-3xl p-10 flex items-center justify-center border border-gray-100">
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name}
              className="max-h-[450px] w-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-500"
            />
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart size={24} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-slate-900 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="currentColor" />)}
              </div>
              <span className="text-slate-400 font-medium">(4.8 / 5.0)</span>
            </div>

            <div className="text-4xl font-black text-emerald-600">
              ₹{product.price?.toLocaleString('en-IN')}
            </div>

            <p className="text-slate-600 text-lg leading-relaxed">{product.description || 'Premium quality electronic product.'}</p>

            <div className="flex items-center gap-6 pt-4">
              <span className="font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border-2 border-slate-100 rounded-2xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-slate-100 transition-colors">
                  <Minus size={18} />
                </button>
                <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-slate-100 transition-colors">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-black text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#00e676] hover:text-black transition-all transform active:scale-95"
              >
                {addingToCart ? <Loader className="animate-spin" size={24} /> : <><ShoppingCart size={24} /> ADD TO CART</>}
              </button>
              
              <button
                onClick={() => { handleAddToCart(); navigate('/cart'); }}
                className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition-all transform active:scale-95"
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}