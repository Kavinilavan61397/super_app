import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';


import Footer from '../../Utility/Footer';
import { FaTrash } from 'react-icons/fa';

function Cart() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    return storedCartItems.map(item => ({
      ...item,
      quantity: parseInt(item.quantity) || 1, // Ensure quantity is a number, default to 1 if not a number
      size: item.size || 'N/A' // Ensure size is stored, default to 'N/A' if not present
    }));
  });

  const navigate = useNavigate(); 
  const handleDelete = (id, category, size) => { // Added size to handleDelete parameters
    const updatedCartList = cartItems.filter((item) => item.id !== id || item.category !== category || item.size !== size); // Filter by id, category, and size
    setCartItems(updatedCartList);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartList));
  };
  const handleClearCart = () => {
    localStorage.removeItem('cartItems'); // Clear cart from localStorage
    setCartItems([]); // Clear cart from component state
    alert('Your cart has been cleared!');
  }
  const handleProceedToPay = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Get existing orders
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];

    // Create a new order object
    const newOrder = {
      id: Date.now(), // unique order id
      items: cartItems,
      status: "Process",
      date: new Date().toISOString()
    };

    // Add new order to orders array
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Clear cart
    localStorage.removeItem('cartItems');
    setCartItems([]);

    // Navigate to orders page
    navigate('/home-clothes/order-list');
  };

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <EcommerceGroceryHeader />
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
              <div className="w-[120px] h-[140px]">
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
                      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
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