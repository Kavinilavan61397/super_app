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
        const response = await fetch('http://localhost:5000/api/gcart', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer demo-token' // Demo token for bypassing auth
          }
        });
        
        if (response.ok) {
          const responseData = await response.json();
          const cartData = responseData.data || [];
          
          // Map backend fields to frontend expectations
          const formatted = cartData.map(item => {
            // Get grocery data from populated field
            const grocery = item.grocery || {};
            
            return {
              ...item,
              // Use grocery data for display fields
              name: grocery.name || 'Unknown Product',
              category: grocery.category || 'Unknown Category',
              image: grocery.image
                ? grocery.image.startsWith('http')
                  ? grocery.image
                  : `http://localhost:5000${grocery.image.startsWith('/') ? '' : '/uploads/'}${grocery.image}`
                : 'https://via.placeholder.com/300x200?text=Image+Coming+Soon',
              originalPrice: parseFloat(grocery.original_price || 0),
              discountedPrice: parseFloat(grocery.discounted_price || 0),
              size: 'N/A' // Grocery items don't have sizes
            };
          });

          setCartItems(formatted);
          console.log('Cart items loaded from database:', formatted);
        } else {
          setCartItems([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading cart from database:', err);
        setCartItems([]);
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  // Delete item from cart (backend)
  const handleDelete = async (groceryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/gcart/${groceryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token' // Demo token for bypassing auth
        }
      });
      
      if (response.ok) {
        setCartItems(prev => prev.filter(item => item.grocery_id !== groceryId));
        console.log('Item deleted from cart:', groceryId);
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (err) {
      console.error('Error deleting item from cart:', err);
      alert('Could not delete item: ' + err.message);
    }
  };

  // Update quantity in cart (backend)
  const handleQuantityChange = async (groceryId, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:5000/api/gcart/${groceryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token' // Demo token for bypassing auth
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      if (response.ok) {
        setCartItems(prev => prev.map(item =>
          item.grocery_id === groceryId
            ? { ...item, quantity: newQuantity }
            : item
        ));
        console.log('Quantity updated for item:', groceryId, 'New quantity:', newQuantity);
      } else {
        throw new Error('Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Could not update quantity: ' + err.message);
    }
  };

  // Clear cart (backend)
  const handleClearCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gcart/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token' // Demo token for bypassing auth
        }
      });
      
      if (response.ok) {
        setCartItems([]);
        alert('Your cart has been cleared!');
        console.log('Cart cleared successfully');
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Could not clear cart: ' + err.message);
    }
  };

  // Proceed to buy (place order)
  const handleProceedToBuy = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty! Please add items before placing an order.');
      return;
    }
    try {
      // Calculate totals
      const totalDiscountedPrice = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
      const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);

      // Prepare order data for backend
      const orderData = {
        total_amount: totalDiscountedPrice,
        shipping_address: 'Default Address', // You can add a form to collect this
        items: cartItems.map(item => ({
          grocery_id: item.grocery_id,
          quantity: item.quantity,
          original_price: item.originalPrice,
          discounted_price: item.discountedPrice,
          name: item.name,
          image: item.image,
          category: item.category
        }))
      };

      // Create order in backend
      const orderResponse = await fetch('http://localhost:5000/api/gorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token' // Demo token for bypassing auth
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');

      // Clear cart in backend
      const clearResponse = await fetch('http://localhost:5000/api/gcart/clear', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token' // Demo token for bypassing auth
        }
      });
      if (!clearResponse.ok) throw new Error('Failed to clear cart in backend');

      // Update UI state
      setCartItems([]);
      alert('Order placed successfully!');
      navigate('/home-grocery/order-list');
    } catch (err) {
      console.error('Error placing order:', err);
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
              key={`${item._id}-${item.grocery_id}`}
              className="bg-white border border-[#E1E1E1] rounded-[20px] mt-4 flex row gap-4 p-4"
            >
              <div className="w-[200px] h-[180px]">
                <img src={item.image} alt="product" className="w-full h-full p-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center w-full">
                  <p className="font-medium text-base text-[#484848]">{item.category}</p>
                  <p className="text-[#5C3FFF] font-medium text-base">
                    {item.originalPrice > item.discountedPrice ? 
                      `${Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% OFF` : 
                      'No Discount'
                    }
                  </p>
                </div>
                <div className="font-semibold text-base text-[#242424] pt-2">{item.name}</div>
                <p className="font-medium text-sm text-[#242424] mb-2">
                  ₹ {parseFloat(item.discountedPrice) * item.quantity} <span className="line-through text-[#C1C1C1]">₹ {parseFloat(item.originalPrice) * item.quantity}</span>
                </p>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center border rounded px-1 py-0.5 bg-white">
                    <button
                      type="button"
                      className="px-2 text-lg font-bold text-gray-700 disabled:text-gray-300"
                      onClick={() => handleQuantityChange(item.grocery_id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span className="mx-2 w-5 text-center select-none">{item.quantity}</span>
                    <button
                      type="button"
                      className="px-2 text-lg font-bold text-gray-700 disabled:text-gray-300"
                      onClick={() => handleQuantityChange(item.grocery_id, Math.min(10, item.quantity + 1))}
                      disabled={item.quantity >= 10}
                    >+</button>
                  </div>
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