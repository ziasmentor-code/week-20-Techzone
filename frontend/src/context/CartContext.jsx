import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await API.get('/cart/');
      console.log('Cart response:', response.data);

      // ✅ Handle different response formats
      let items = [];
      
      if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data.cart_items && Array.isArray(response.data.cart_items)) {
        items = response.data.cart_items;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        items = response.data.items;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      } else {
        console.log('Empty or invalid cart format, using empty array');
        items = [];
      }

      setCartItems(items);
      
      // Calculate count and total
      const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
      
      setCartCount(count);
      setCartTotal(total);
      
    } catch (error) {
      console.error('Cart fetch error:', error);
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const response = await API.post('/cart/', {
        product_id: product.id,
        quantity: quantity
      });
      
      if (response.status === 200 || response.status === 201) {
        await fetchCart(); // Refresh cart
        return { success: true, message: 'Added to cart' };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add to cart' };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await API.put(`/cart/${itemId}/`, { quantity });
      
      if (response.status === 200) {
        await fetchCart();
        return { success: true, message: 'Cart updated' };
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false, message: 'Failed to update cart' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await API.delete(`/cart/${itemId}/`);
      
      if (response.status === 200 || response.status === 204) {
        await fetchCart();
        return { success: true, message: 'Removed from cart' };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, message: 'Failed to remove from cart' };
    }
  };

  const clearCart = async () => {
    try {
      const response = await API.delete('/cart/clear/');
      
      if (response.status === 200) {
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
        return { success: true, message: 'Cart cleared' };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Failed to clear cart' };
    }
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};