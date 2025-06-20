import React, { useState, useEffect } from 'react';
import Header from "../SubPages/Header";
import Footer from '../SubPages/Footer';
import { useNavigate } from 'react-router-dom';

function Myorders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Fetch orders from localStorage on mount
    useEffect(() => {
        setLoading(true);
        setError(null);
        try {
            const storedOrders = JSON.parse(localStorage.getItem('Gorders')) || [];
            setOrders(storedOrders);
        } catch (err) {
            setError('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Buy Again handler (localStorage)
    const handleBuyAgain = async (item) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to add items to your cart.');
                navigate('/login');
                return;
            }
            const cartPayload = {
                groceryId: item.id || item.product_id,
                name: item.name,
                image: item.image,
                category: item.category,
                original_price: item.originalPrice || item.price,
                discounted_price: item.discountedPrice || item.price,
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
            alert('Item added to cart!');
        } catch (err) {
            alert('Could not add to cart: ' + err.message);
        }
    };

    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <Header />
            <div className='px-4 pt-24 pb-28 bg-[#F8F8F8]'>
                <h2 className='font-bold text-2xl mb-4'>Your Orders</h2>
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading orders...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No orders placed yet.</div>
                ) : (
                    orders.slice().reverse().map(order => (
                        <div key={order.orderId || order.id} className="bg-white border border-[#E1E1E1] rounded-[20px] mt-4 p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <span>Order Placed:</span>
                                        <span className="font-medium">{order.date ? new Date(order.date).toLocaleDateString() : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <span>Order ID:</span>
                                        <span className="font-mono">OD-{order.orderId || order.id}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <span>Status:</span>
                                        <span className="font-medium capitalize">{order.status || 'Delivered'}</span>
                                    </div>
                                </div>
                                <div className="text-right mt-2 md:mt-0">
                                    <div className="text-lg font-bold text-[#5C3FFF]">₹ {order.totalDiscountedPrice || order.total_amount}</div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                                <button
                                    className="text-xs text-[#5C3FFF] underline"
                                    onClick={() => setExpandedOrder(expandedOrder === (order.orderId || order.id) ? null : (order.orderId || order.id))}
                                >
                                    {expandedOrder === (order.orderId || order.id) ? 'Hide Details' : 'View Details'}
                                </button>
                            </div>
                            {expandedOrder === (order.orderId || order.id) && (
                                <>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {order.items.map(item => (
                                            <div key={item.id || item.product_id} className="flex items-center gap-4 border rounded-lg p-2 bg-gray-50">
                                                <img src={item.image || item.product_data?.image || 'https://via.placeholder.com/80'} alt={item.name || item.product_data?.name} className="w-20 h-20 object-cover rounded" />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-base text-[#242424]">{item.name || item.product_data?.name}</div>
                                                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                                                    <div className="text-sm text-gray-600">Price: ₹ {item.discountedPrice || item.price}</div>
                                                    <button
                                                        className="mt-2 px-3 py-1 bg-[#5C3FFF] text-white rounded-full text-xs hover:bg-[#4a32cc]"
                                                        onClick={() => handleBuyAgain(item)}
                                                    >
                                                        Buy Again
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 border-t pt-4">
                                        <div className="font-semibold mb-2">Order Details</div>
                                        <div className="text-sm text-gray-700 mb-1">Order placed on: {order.date ? new Date(order.date).toLocaleString() : ''}</div>
                                        <div className="text-sm text-gray-700 mb-1">Order ID: OD-{order.orderId || order.id}</div>
                                        <div className="text-sm text-gray-700 mb-1">Status: {order.status || 'Delivered'}</div>
                                        <div className="text-sm text-gray-700 mb-1">Total: ₹ {order.totalDiscountedPrice || order.total_amount}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
}
export default Myorders;
