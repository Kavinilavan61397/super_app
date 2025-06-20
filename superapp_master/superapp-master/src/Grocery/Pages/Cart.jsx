import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../SubPages/Header';

import Delete from '../Images/delete.svg';
import Footer from '../SubPages/Footer';
import { FaTrash } from 'react-icons/fa';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // Helper to check auth and redirect
  const handleAuthError = (err) => {
    if (err.message === 'Unauthorized' || err.status === 401) {
      alert('Session expired. Please log in again.');
      navigate('/login');
      return true;
    }
    return false;
  };

  // Fetch cart items from backend on mount
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to view your cart.');
          navigate('/login');
          return;
        }
        const response = await fetch('http://localhost:5000/api/gcart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 401) throw { message: 'Unauthorized', status: 401 };
        if (!response.ok) throw new Error('Failed to fetch cart items');
        const data = await response.json();

        // Map backend fields to frontend expectations
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
        setLoading(false);
      } catch (err) {
        if (!handleAuthError(err)) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    fetchCartItems();
  }, []);

  // Delete item from cart (backend)
  const handleDelete = async (groceryId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete items from your cart.');
        navigate('/login');
        return;
      }
      const response = await fetch(`http://localhost:5000/api/gcart/${groceryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 401) throw { message: 'Unauthorized', status: 401 };
      if (!response.ok) throw new Error('Failed to delete item');
      setCartItems(prev => prev.filter(item => item.grocery_id !== groceryId));
    } catch (err) {
      if (!handleAuthError(err)) {
        alert('Could not delete item: ' + err.message);
      }
    }
  };

  // Update quantity in cart (backend)
  const handleQuantityChange = async (groceryId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to update your cart.');
        navigate('/login');
        return;
      }
      const response = await fetch(`http://localhost:5000/api/gcart/${groceryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (response.status === 401) throw { message: 'Unauthorized', status: 401 };
      if (!response.ok) throw new Error('Failed to update quantity');
      setCartItems(prev => prev.map(item =>
        item.grocery_id === groceryId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } catch (err) {
      if (!handleAuthError(err)) {
        alert('Could not update quantity: ' + err.message);
      }
    }
  };

  // Clear cart (backend)
  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to clear your cart.');
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:5000/api/gcart/clear', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 401) throw { message: 'Unauthorized', status: 401 };
      if (!response.ok) throw new Error('Failed to clear cart');
      setCartItems([]);
      alert('Your cart has been cleared!');
    } catch (err) {
      if (!handleAuthError(err)) {
        alert('Could not clear cart: ' + err.message);
      }
    }
  };

  // Proceed to buy (place order)
  const handleProceedToBuy = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty! Please add items before placing an order.');
      return;
    }
    try {
      // Read existing orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem('Gorders')) || [];
      // Create new order object
      const newOrder = {
        orderId: Date.now(),
        date: new Date().toISOString(),
        status: 'Delivered',
        items: cartItems,
        totalDiscountedPrice: cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0),
        totalOriginalPrice: cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0)
      };
      // Add new order to orders array
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('Gorders', JSON.stringify(updatedOrders));
      // Clear cart in backend
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:5000/api/gcart/clear', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to clear cart in backend');
      }
      // Update UI state
      setCartItems([]);
      alert('Order placed successfully!');
      navigate('/home-grocery/order-list');
    } catch (err) {
      alert('Could not place order: ' + err.message);
    }
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <Header />
      <div className="px-4 pt-24 pb-40">
      <div className="flex justify-between items-center mb-4">
        <div className="font-medium text-base">My Carts</div>
        <button
            onClick={handleClearCart}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm"
          >
            Clear Cart
          </button></div>
        {loading ? (
          <div className="flex items-center justify-center h-[50vh] text-center text-[#484848] text-lg">Loading cart...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-[50vh] text-center text-red-500 text-lg">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh] text-center text-[#484848] text-lg">Your cart is empty</div>
        ) : (
          cartItems.slice().reverse().map((item) => (
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
                {item.size !== 'N/A' && (
                  <p className="font-medium text-sm text-[#484848] mb-2">
                    Size: {item.size}
                  </p>
                )}
                <p className="font-medium text-sm text-[#242424] mb-2">
                  ₹ {parseFloat(item.discountedPrice) * item.quantity} <span className="line-through text-[#C1C1C1]">₹ {parseFloat(item.originalPrice) * item.quantity}</span>
                </p>
                <div className="flex justify-between items-center w-full">
                  <select
                    className="py-0 rounded-full border border-[#CCCCCC] px-3"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.grocery_id, parseInt(e.target.value))}
                  >
                    {[...Array(10).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <button
                    className="p-1 rounded-full text-purple-600 hover:bg-purple-100 transition-colors"
                    onClick={() => handleDelete(item.grocery_id)}
                    aria-label="Delete item"
                  >
                    <FaTrash className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="fixed bottom-24 left-0 w-full px-4 py-4">
        <button
          onClick={handleProceedToBuy}
          className={`w-full px-4 py-2 rounded-[50px] text-white ${
            cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5C3FFF]'
          }`}
          disabled={cartItems.length === 0}
        >
          Proceed to Buy
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Cart;