import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Context നിർമ്മിക്കുന്നു
const CartContext = createContext();

// 2. useCart ഹുക്ക് എക്സ്പോർട്ട് ചെയ്യുന്നു (ഇവിടെ export ഉണ്ടെന്ന് ഉറപ്പാക്കുക)
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 3. Provider കമ്പോണന്റ്
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് ഡാറ്റ ലോഡ് ചെയ്യുന്നു
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Cart parse error:", error);
      }
    }
  }, []);

  // കാർട്ടിൽ മാറ്റം വരുമ്പോൾ ലോക്കൽ സ്റ്റോറേജിലേക്ക് സേവ് ചെയ്യുന്നു
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
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