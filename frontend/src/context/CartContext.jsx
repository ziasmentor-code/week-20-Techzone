import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios'; // നിങ്ങളുടെ axios ഇൻസ്റ്റൻസ് ഇമ്പോർട്ട് ചെയ്യുക

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 1. ആപ്പ് ലോഡ് ചെയ്യുമ്പോൾ ബാക്കെൻഡിൽ നിന്ന് കാർട്ട് ഡാറ്റ എടുക്കുന്നു
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await API.get('cart/'); // ബാക്കെൻഡിൽ കാർട്ട് കാണാനുള്ള URL
        setCart(response.data.items || []);
      } catch (error) {
        console.error("Cart fetch error:", error);
        // ബാക്കെൻഡിൽ നിന്ന് കിട്ടിയില്ലെങ്കിൽ ലോക്കൽ സ്റ്റോറേജ് ഉപയോഗിക്കാം
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      }
    };
    fetchCart();
  }, []);

  // 2. ബാക്കെൻഡിലേക്ക് പ്രൊഡക്റ്റ് ആഡ് ചെയ്യുന്നു
  const addToCart = async (product) => {
    try {
      // ബാക്കെൻഡ് എപിഐ കോൾ
      await API.post('cart/add/', {
        product_id: product.id,
        quantity: 1
      });

      // ഫ്രണ്ട് എൻഡ് സ്റ്റേറ്റ് അപ്‌ഡേറ്റ് ചെയ്യുന്നു
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        const updatedCart = existingItem
          ? prevCart.map((item) =>
              item.id === product.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
            )
          : [...prevCart, { ...product, quantity: 1 }];
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Could not sync with server. Please login again.");
    }
  };

  // 3. ക്വാണ്ടിറ്റി അപ്‌ഡേറ്റ് ചെയ്യുന്നു
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    try {
      await API.post('cart/update/', { product_id: productId, quantity: newQuantity });
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // 4. കാർട്ടിൽ നിന്ന് ഒഴിവാക്കുന്നു
  const removeFromCart = async (productId) => {
    try {
      await API.delete(`cart/remove/${productId}/`);
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Remove failed:", error);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};