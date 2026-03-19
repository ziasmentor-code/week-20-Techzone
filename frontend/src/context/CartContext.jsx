import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

// ഈ 'useCart' ഫംഗ്ഷൻ ഉണ്ടെന്ന് ഉറപ്പാക്കുക, ഇതാണ് എററിന് കാരണം
export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axios.get('http://localhost:8000/api/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(res.data);
        } catch (err) {
            console.error("Cart error:", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};