import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await API.get('/wishlist/');
      console.log('Wishlist response:', response.data);

      // ✅ Handle different response formats
      let items = [];
      
      if (Array.isArray(response.data)) {
        // If response is directly an array
        items = response.data;
      } else if (response.data.wishlist_items && Array.isArray(response.data.wishlist_items)) {
        // If response has wishlist_items key
        items = response.data.wishlist_items;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        // If response has items key
        items = response.data.items;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // If response has data key
        items = response.data.data;
      } else {
        console.log('Empty or invalid wishlist format, using empty array');
        items = [];
      }

      setWishlistItems(items);
      setWishlistCount(items.length);
      
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
      setWishlistCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    try {
      const response = await API.post('/wishlist/', { product_id: product.id });
      
      if (response.status === 200 || response.status === 201) {
        await fetchWishlist(); // Refresh wishlist
        return { success: true, message: 'Added to wishlist' };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await API.delete(`/wishlist/${productId}/`);
      
      if (response.status === 200 || response.status === 204) {
        await fetchWishlist(); // Refresh wishlist
        return { success: true, message: 'Removed from wishlist' };
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Failed to remove from wishlist' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId || item.product?.id === productId);
  };

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};