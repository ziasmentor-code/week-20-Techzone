import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch wishlist from API
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.get('wishlist/'); // axios.js baseURL ഉപയോഗിക്കുന്നു
      
      console.log('Wishlist response:', response.data);
      
      // ബാക്കെൻഡ് response.data.wishlist_items എന്ന രൂപത്തിലാണോ എന്ന് പരിശോധിക്കുന്നു
      if (response.data && Array.isArray(response.data.wishlist_items)) {
        setWishlistItems(response.data.wishlist_items);
      } else if (Array.isArray(response.data)) {
        setWishlistItems(response.data);
      } else {
        console.warn('Unexpected response format. Expected an array or wishlist_items key:', response.data);
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status !== 401) {
        setError('Wishlist fetch ചെയ്യുന്നതിൽ പ്രശ്നം');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add to wishlist
  const addToWishlist = async (product) => {
    try {
      setLoading(true);
      // ബാക്കെൻഡ് പ്രതീക്ഷിക്കുന്ന പേലോഡ്
      const payload = { product_id: product.id };
      
      await API.post('wishlist/', payload);
      
      // ലോക്കൽ സ്റ്റേറ്റിലേക്ക് പ്രോഡക്റ്റ് ചേർക്കുന്നു
      setWishlistItems(prev => {
        const exists = prev.find(item => item.id === product.id);
        return exists ? prev : [...prev, product];
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: error.response?.data?.error || 'Failed to add' };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      await API.delete(`wishlist/${productId}/`);
      
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Failed to remove' };
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => wishlistItems.some(item => item.id === productId);

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  const clearWishlist = () => setWishlistItems([]);

  // മൗണ്ട് ചെയ്യുമ്പോൾ മാത്രം റൺ ചെയ്യുന്നു
  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlistItems, loading, error, addToWishlist,
      removeFromWishlist, isInWishlist, toggleWishlist,
      fetchWishlist, clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}