import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../SubPages/Header';
import Delete from '../Images/delete.svg';
import Footer from '../SubPages/Footer';
import { FaTrash } from 'react-icons/fa';

function WishList() {

  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems]   = useState([]);

  const token = localStorage.getItem('token');   // JWT once at component scope
  const API   = 'http://localhost:5000/api/gwishlist';

  // 🔁 Fetch wishlist from backend on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;               // not logged in
      try {
        const res  = await fetch(API, { headers: { Authorization: `Bearer ${token}` }});
        if (!res.ok) throw new Error('Failed to load wishlist');
        const data = await res.json();  // [{ id, grocery_id, ... }]
        // Map backend fields to frontend fields for price
        const formatted = data.map(item => ({
          ...item,
          discountedPrice: parseFloat(item.discounted_price ?? item.discountedPrice ?? 0),
          originalPrice: parseFloat(item.original_price ?? item.originalPrice ?? 0),
        }));
        setWishlistItems(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    // still initialise cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem('GcartItems')) || [];
    setCartItems(storedCart);

    fetchWishlist();
  }, [token]);

  // 🔁 DELETE a single item both backend + state
  const handleRemove = async (rowId) => {
    try {
      const res = await fetch(`${API}/${rowId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      setWishlistItems(prev => prev.filter(i => i.id !== rowId));
    } catch (err) {
      console.error(err);
      alert('Could not delete item');
    }
  };

  // 🔁 CLEAR entire wishlist (loop through current IDs)
  
  const handleClearWishlist = async () => {
    if (!token) return;
    try {
      await Promise.all(
        wishlistItems.map(i =>
          fetch(`${API}/${i.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      setWishlistItems([]);
      alert('Your wishlist has been cleared!');
    } catch (err) {
      console.error(err);
      alert('Failed to clear wishlist');
    }
  };

  // 🔁 keep "inCart" flag up‑to‑date
  useEffect(() => {
    setWishlistItems(prev =>
      prev.map(w => ({
        ...w,
        inCart: cartItems.some(c => c.grocery_id === w.grocery_id),
        quantity: w.quantity || 1
      }))
    );
  }, [cartItems]);

  // Add this function to fetch cart items from backend:
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:5000/api/gcart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch cart items');
      const data = await response.json();
      const formatted = data.map(item => ({
        ...item,
        originalPrice: parseFloat(item.original_price ?? item.originalPrice ?? 0),
        discountedPrice: parseFloat(item.discounted_price ?? item.discountedPrice ?? 0),
        image: item.image
          ? item.image.startsWith('http')
            ? item.image
            : `http://localhost:5000${item.image.startsWith('/') ? '' : '/uploads/'}${item.image}`
          : 'https://via.placeholder.com/300x200?text=Image+Coming+Soon',
        size: item.size || 'N/A'
      }));
      setCartItems(formatted);
    } catch (err) {
      setCartItems([]);
    }
  };

  // Call fetchCartItems on mount:
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Update handleAddToCart to use backend:
  const handleAddToCart = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to your cart.');
        return;
      }
      const cartPayload = {
        groceryId: item.grocery_id || item.id,
        name: item.name,
        image: item.image,
        category: item.category,
        original_price: item.originalPrice,
        discounted_price: item.discountedPrice,
        quantity: item.quantity || 1
      };
      const response = await fetch('http://localhost:5000/api/gcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cartPayload)
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      await fetchCartItems();
      alert('Item added to cart!');
    } catch (err) {
      alert('Could not add to cart: ' + err.message);
    }
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <Header />
      <div className="px-4 pt-24 pb-40">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium text-base">My Wishlist</div>
          <button
            onClick={handleClearWishlist}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm"
          >
            Clear Wishlist
          </button>
        </div>
        {wishlistItems.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh] text-center text-[#484848] text-lg">
            Your wishlist is empty
          </div>
        ) : (
          wishlistItems.map((item) => (
            <div
              key={`${item.id}-${item.category}-${item.size}`}
              className="bg-white border border-[#E1E1E1] rounded-[20px] mt-4 flex row gap-4 p-4"
            >
              <div className="w-[200px] h-[180px]">
                <img src={item.image} alt="product" className="w-full h-full p-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center w-full">
                  <p className="font-medium text-base text-[#484848]">{item.category}</p>
                  <p className="text-[#5C3FFF] font-medium text-base">{item.discount}</p>
                </div>
                <div className="font-semibold text-base text-[#242424] pt-2">{item.name}</div>
                {item.size && item.size !== 'N/A' && (
                  <p className="font-medium text-sm text-[#484848] mb-2">
                    Size: {item.size}
                  </p>
                )}
                <p className="font-medium text-sm text-[#484848] mb-2">
                  Quantity: {item.quantity || 1}
                </p>
                <p className="font-medium text-sm text-[#242424] mb-2">
                  ₹ {parseFloat(item.discountedPrice)} <span className="line-through text-[#C1C1C1]">₹ {parseFloat(item.originalPrice)}</span>
                </p>
                <div className="flex justify-between items-center w-full">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.inCart || cartItems.some(c => c.grocery_id === item.grocery_id)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      item.inCart || cartItems.some(c => c.grocery_id === item.grocery_id)
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-[#5C3FFF] text-white hover:bg-[#4a32cc]'
                    }`}
                  >
                    {item.inCart || cartItems.some(c => c.grocery_id === item.grocery_id) ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                  <button
                    className="p-1 rounded-full text-purple-600 hover:bg-purple-100 transition-colors"
                    onClick={() => handleRemove(item.id, item.category, item.size)}
                    aria-label="Remove from wishlist"
                  >
                    <FaTrash className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default WishList;