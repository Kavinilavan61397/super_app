import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../SubPages/Header';

import Delete from '../Images/delete.svg';
import Footer from '../SubPages/Footer';
import { FaTrash } from 'react-icons/fa';

function Cart() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('GcartItems')) || [];
    return storedCartItems.map(item => ({
      ...item,
      quantity: parseInt(item.quantity) || 1, // Ensure quantity is a number, default to 1 if not a number
      size: item.size || 'N/A' // Ensure size is stored, default to 'N/A' if not present
    }));
  });

  const navigate = useNavigate(); 

  // Listen for storage changes from other components (e.g., when cart is cleared by order placement)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'GcartItems') {
        setCartItems(JSON.parse(e.newValue) || []);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDelete = (id, category, size) => { // Added size to handleDelete parameters
    const updatedCartList = cartItems.filter((item) => item.id !== id || item.category !== category || item.size !== size); // Filter by id, category, and size
    setCartItems(updatedCartList);
    localStorage.setItem('GcartItems', JSON.stringify(updatedCartList));
  };
  const handleClearCart = () => {
    localStorage.removeItem('GcartItems'); // Clear cart from localStorage
    setCartItems([]); // Clear cart from component state
    alert('Your cart has been cleared!');
  }
  const handleProceedToPay = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty! Please add items before placing an order.'); 
      return;
    }

    const newOrderId = Date.now().toString(); // Simple unique ID
    const totalOriginalPrice = cartItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
    const totalDiscountedPrice = cartItems.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);

    const newOrder = {
      orderId: newOrderId,
      items: cartItems.map(item => ({ ...item })), // Deep copy of cart items
      timestamp: new Date().toISOString(),
      status: 'Process',
      orderHistory: [
        { status: 'Process', timestamp: new Date().toISOString() }
      ],
      totalOriginalPrice,
      totalDiscountedPrice,
    };

    // Retrieve existing orders or initialize an empty array
    const existingOrders = JSON.parse(localStorage.getItem('Gorders')) || [];
    const updatedOrders = [newOrder, ...existingOrders]; // Add new order to the beginning

    localStorage.setItem('Gorders', JSON.stringify(updatedOrders));
    localStorage.removeItem('GcartItems'); // Clear cart after placing order
    setCartItems([]); // Update state to reflect empty cart

    // Dispatch storage events to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'Gorders',
      newValue: JSON.stringify(updatedOrders)
    }));
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'GcartItems',
      newValue: JSON.stringify([])
    }));

    alert(`Order ${newOrderId} placed successfully!`);
    navigate('/home-grocery/order-list'); // Navigate to orders page
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <Header />
      <div className="px-4 pt-24 pb-40">
      <div className="flex justify-between items-center mb-4">
        <div className="font-medium text-base">My Carts</div>
        <button
            onClick={() => handleClearCart()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm"
          >
            Clear Cart
          </button></div>
        {cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh] text-center text-[#484848] text-lg">Your cart is empty</div>
        ) : (
          cartItems.map((item) => (
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
                    onChange={(e) => {
                      const updatedItems = cartItems.map((cartItem) =>
                        cartItem.id === item.id && cartItem.category === item.category && cartItem.size === item.size
                          ? { ...cartItem, quantity: parseInt(e.target.value) }
                          : cartItem
                      );
                      setCartItems(updatedItems);
                      localStorage.setItem('GcartItems', JSON.stringify(updatedItems));
                    }}
                  >
                    {[...Array(10).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <button
                    className="p-1 rounded-full text-purple-600 hover:bg-purple-100 transition-colors"
                    onClick={() => handleDelete(item.id, item.category, item.size)}
                    aria-label="Delete item"
                  >
                    <FaTrash className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        
        <div className="fixed bottom-24 left-0 w-full px-4 py-4">
          <button
            onClick={handleProceedToPay} // Add click handler
            className={`w-full px-4 py-2 rounded-[50px] text-white ${
              cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5C3FFF]'
            }`}
            disabled={cartItems.length === 0} // Disable button if cart is empty
          >
            Proceed to Pay
          </button>
          </div>
      </div>
      <Footer />
    </div>
  );
}

export default Cart;