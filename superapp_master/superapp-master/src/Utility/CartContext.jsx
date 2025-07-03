import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  fetchWishlist,
  addToWishlist as apiAddToWishlist,
  removeWishlistItem as apiRemoveWishlistItem
} from '../services/cartWishlistService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null); // cart object with items
  const [wishlist, setWishlist] = useState([]); // wishlist array
  const [loading, setLoading] = useState(true);

  // Fetch cart and wishlist on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const cartRes = await fetchCart();
        if (cartRes.success) setCart(cartRes.data);
        const wishlistRes = await fetchWishlist();
        if (wishlistRes.success) setWishlist(wishlistRes.data);
      } catch (e) {
        setCart(null);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Cart actions
  const addToCart = async (product_id, quantity = 1) => {
    const res = await apiAddToCart(product_id, quantity);
    if (res.success) setCart(res.data);
    return res;
  };
  const updateCartItem = async (itemId, quantity) => {
    const res = await apiUpdateCartItem(itemId, quantity);
    if (res.success) setCart(res.data);
    return res;
  };
  const removeFromCart = async (itemId) => {
    const res = await apiRemoveCartItem(itemId);
    if (res.success) setCart(res.data);
    return res;
  };

  // Wishlist actions
  const addToWishlist = async (product_id, quantity = 1) => {
    const res = await apiAddToWishlist(product_id, quantity);
    if (res.success) setWishlist((prev) => [...prev, res.data]);
    return res;
  };
  const removeFromWishlist = async (itemId) => {
    const res = await apiRemoveWishlistItem(itemId);
    if (res.success) setWishlist((prev) => prev.filter(item => item.id !== itemId));
    return res;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        setCart,
        setWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
