import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import EcommerceGroceryHeader from '../../Components/EcommerceGroceryHeader';
import axios from 'axios';
import Footer from '../../Utility/Footer';
import { FaTrash } from 'react-icons/fa';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please login to view your cart');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Cart response:', response.data);
        
        if (response.data.success && response.data.data) {
          // Transform the data to match frontend expectations
          const transformedItems = response.data.data.items?.map(item => ({
            id: item.id,
            product_id: item.product_id,
            name: item.product?.name || 'Product',
            image: item.product?.photo || item.product?.featured_image || '/default-product.jpg',
            category: item.product?.category?.name || 'Category',
            originalPrice: parseFloat(item.product?.price || 0),
            discountedPrice: parseFloat(item.product?.sale_price || item.product?.price || 0),
            quantity: item.quantity,
            size: item.variation?.attributes?.size || 'N/A',
            price: parseFloat(item.price || 0),
            total_price: parseFloat(item.total_price || 0)
          })) || [];
          
          setCartItems(transformedItems);
        } else {
          setCartItems([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching cart:', err);
        if (err.response?.status === 401) {
          setError('Please login to view your cart');
        } else {
          setError('Failed to load cart items');
        }
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Delete item from cart
  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to manage your cart');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/cart/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Remove the item from local state
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        alert('Item removed from cart successfully!');
      } else {
        alert('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
      if (error.response?.status === 401) {
        alert('Please login to manage your cart');
      } else {
        alert('Failed to remove item from cart: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Update item quantity
  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to manage your cart');
        return;
      }

      const response = await axios.put(`http://localhost:5000/api/cart/items/${itemId}`, {
        quantity: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Update the item in local state
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        alert('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      if (error.response?.status === 401) {
        alert('Please login to manage your cart');
      } else {
        alert('Failed to update quantity: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to manage your cart');
        return;
      }

      const response = await axios.delete('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCartItems([]);
        alert('Your cart has been cleared!');
      } else {
        alert('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      if (error.response?.status === 401) {
        alert('Please login to manage your cart');
      } else {
        alert('Failed to clear cart: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleProceedToPay = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!'); 
      return;
    }
    navigate('/home-clothes/order-list', { state: { cartItems } });
  };

  // Calculate total
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);

  if (loading) {
    return (
      <div className="bg-[#F8F8F8] min-h-screen">
        <EcommerceGroceryHeader />
        <div className="px-4 pt-24 pb-40">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center text-[#484848] text-lg">Loading cart...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F8F8F8] min-h-screen">
        <EcommerceGroceryHeader />
        <div className="px-4 pt-24 pb-40">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center text-[#484848] text-lg">{error}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <EcommerceGroceryHeader />
      <div className="px-4 pt-24 pb-40">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium text-base">My Cart</div>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh] text-center text-[#484848] text-lg">
            Your cart is empty
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E1E1E1] rounded-[20px] mt-4 flex row gap-4 p-4"
              >
                <div className="w-[120px] h-[140px]">
                  <img src={item.image} alt="product" className="w-full h-full p-4 object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center w-full">
                    <p className="font-medium text-base text-[#484848]">{item.category}</p>
                    {item.originalPrice > item.discountedPrice && (
                      <p className="text-[#5C3FFF] font-medium text-base">
                        {Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% OFF
                      </p>
                    )}
                  </div>
              
                  <div className="font-semibold text-base text-[#242424] pt-2">{item.name}</div>
                  {item.size !== 'N/A' && (
                    <p className="font-medium text-sm text-[#484848] mb-2">
                      Size: {item.size}
                    </p>
                  )}
                  <p className="font-medium text-sm text-[#242424] mb-2">
                    ₹ {item.discountedPrice * item.quantity} 
                    {item.originalPrice > item.discountedPrice && (
                      <span className="line-through text-[#C1C1C1] ml-2">₹ {item.originalPrice * item.quantity}</span>
                    )}
                  </p>
                  <div className="flex justify-between items-center w-full">
                    <select
                      className="py-0 rounded-full border border-[#CCCCCC] px-3"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    >
                      {[...Array(10).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <button
                      className="p-1 rounded-full text-purple-600 hover:bg-purple-100 transition-colors"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete item"
                    >
                      <FaTrash className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Total Amount */}
            <div className="bg-white border border-[#E1E1E1] rounded-[20px] mt-4 p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total:</span>
                <span className="font-bold text-xl text-[#5C3FFF]">₹ {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
        
        <div className="fixed bottom-24 left-0 w-full px-4 py-4">
          <button
            onClick={handleProceedToPay}
            className={`w-full px-4 py-2 rounded-[50px] text-white ${
              cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5C3FFF]'
            }`}
            disabled={cartItems.length === 0}
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