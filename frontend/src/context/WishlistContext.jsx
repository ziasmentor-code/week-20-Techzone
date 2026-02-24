import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch wishlist from API
  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    
    // ടോക്കൺ ഇല്ലെങ്കിൽ എറർ ഒഴിവാക്കാൻ റിട്ടേൺ ചെയ്യുന്നു
    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await API.get('/wishlist/', {
        // 'Token' എന്നതിന് പകരം 'Bearer' ഉപയോഗിക്കുക (നിങ്ങൾ JWT ആണ് ഉപയോഗിക്കുന്നതെങ്കിൽ)
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) {
        // ടോക്കൺ ഇൻവാലിഡ് ആണെങ്കിൽ ക്ലിയർ ചെയ്യാം
        // localStorage.removeItem('token'); 
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add to wishlist
  const addToWishlist = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to add items to wishlist");
        return false;
      }

      await API.post('/wishlist/', { 
        product_id: product.id  // ബാക്കെൻഡ് പ്രതീക്ഷിക്കുന്ന കീ (Key) ശ്രദ്ധിക്കുക
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlistItems(prev => [...prev, product]);
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  // ✅ Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      await API.delete(`/wishlist/${productId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  // പേജ് ലോഡ് ചെയ്യുമ്പോൾ മാത്രം ഫെച്ച് ചെയ്യുന്നു
  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}