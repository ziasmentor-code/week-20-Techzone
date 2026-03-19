import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    const fetchWishlist = async () => {
        const token = localStorage.getItem('access');
        if (!token) return;

        try {
            const res = await axios.get('http://localhost:8000/api/wishlist/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(res.data);
        } catch (err) {
            console.error("Wishlist fetch error:", err);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    return (
        <WishlistContext.Provider value={{ wishlist, setWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);