import React, { useState, useEffect } from 'react';
import Header from "../SubPages/Header";
import Footer from '../SubPages/Footer';
import { useNavigate } from 'react-router-dom';

// Order Status Timeline Component
const OrderStatusTimeline = ({ status, orderDate }) => {
    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: '📋', color: 'bg-blue-500' },
        { key: 'processing', label: 'Processing', icon: '⚙️', color: 'bg-yellow-500' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚', color: 'bg-orange-500' },
        { key: 'delivered', label: 'Delivered', icon: '✅', color: 'bg-green-500' }
    ];

    const getCurrentStepIndex = () => {
        const stepIndex = statusSteps.findIndex(step => step.key === status);
        return stepIndex >= 0 ? stepIndex : 0;
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Order Status</h3>
            <div className="relative">
                {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                        <div key={step.key} className="flex items-center mb-4">
                            {/* Timeline Line */}
                            {index < statusSteps.length - 1 && (
                                <div className={`absolute left-6 top-8 w-0.5 h-8 ${
                                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                }`}></div>
                            )}
                            
                            {/* Status Icon */}
                            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg ${
                                isCompleted ? step.color : 'bg-gray-300'
                            }`}>
                                {step.icon}
                            </div>
                            
                            {/* Status Details */}
                            <div className="ml-4 flex-1">
                                <div className={`font-medium ${
                                    isCompleted ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                    {step.label}
                                </div>
                                {isCurrent && (
                                    <div className="text-sm text-blue-600 font-medium">
                                        Current Status
                                    </div>
                                )}
                                {index === 0 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        {orderDate ? new Date(orderDate).toLocaleString() : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Status Badge */}
            <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    status === 'delivered' ? 'bg-green-100 text-green-800' :
                    status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                    status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                    {status.replace(/_/g, ' ').toUpperCase()}
                </span>
            </div>
        </div>
    );
};

function Myorders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Helper to check auth and redirect
    const handleAuthError = (err) => {
        if (err.message === 'Unauthorized' || err.status === 401) {
            alert('Session expired. Please log in again.');
            navigate('/login');
            return true;
        }
        return false;
    };

    // Fetch orders from backend on mount
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Please log in to view your orders.');
                    navigate('/login');
                    return;
                }
                
                const response = await fetch('http://localhost:5000/api/gorders/my-orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 401) throw { message: 'Unauthorized', status: 401 };
                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                console.log('API data:',data);

                // Transform backend data to match frontend expectations
                const transformedOrders = data.map(order => ({
                    id: order.id,
                    orderId: order.id,
                    date: order.created_at,
                    status: order.status,
                    total_amount: parseFloat(order.total_amount),
                    totalDiscountedPrice: parseFloat(order.total_amount),
                    items: order.items ? order.items.map(item => ({
                        id: item.id,
                        grocery_id: item.grocery_id,
                        name: item.name,
                        image: item.image
                            ? item.image.startsWith('http')
                                ? item.image
                                : `http://localhost:5000${item.image.startsWith('/') ? '' : '/uploads/'}${item.image}`
                            : 'https://via.placeholder.com/300x200?text=Image+Coming+Soon',
                        category: item.category,
                        quantity: item.quantity,
                        originalPrice: parseFloat(item.original_price || 0),
                        discountedPrice: parseFloat(item.discounted_price || 0),
                        price: parseFloat(item.discounted_price || 0)
                    })) : []
                }));

                setOrders(transformedOrders);
                setLoading(false);
            } catch (err) {
                if (!handleAuthError(err)) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };
        fetchOrders();
    }, [navigate]);

    // Buy Again handler (backend)
    const handleBuyAgain = async (item) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to add items to your cart.');
                navigate('/login');
                return;
            }
            const cartPayload = {
                groceryId: item.grocery_id,
                name: item.name,
                image: item.image,
                category: item.category,
                original_price: item.originalPrice,
                discounted_price: item.discountedPrice,
                quantity: 1
            };
            const response = await fetch('http://localhost:5000/api/gcart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(cartPayload)
            });
            if (response.status === 401) throw { message: 'Unauthorized', status: 401 };
            if (!response.ok) throw new Error('Failed to add to cart');
            alert('Item added to cart!');
        } catch (err) {
            if (!handleAuthError(err)) {
                alert('Could not add to cart: ' + err.message);
            }
        }
    };

    // Update Order Status (for testing - can be removed later)
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to update order status.');
                navigate('/login');
                return;
            }
            
            const response = await fetch(`http://localhost:5000/api/gorders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (response.status === 401) throw { message: 'Unauthorized', status: 401 };
            if (!response.ok) throw new Error('Failed to update order status');
            
            // Refresh orders to show updated status
            window.location.reload();
        } catch (err) {
            if (!handleAuthError(err)) {
                alert('Could not update order status: ' + err.message);
            }
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
                            <div className="flex justify-between items-start">
                                {/* Left Side: Order Info */}
                                <div>
                                    <p className="text-sm text-gray-500">Order Placed:</p>
                                    <p className="text-sm text-gray-800 font-medium mb-1">{order.date ? new Date(order.date).toLocaleDateString() : ''}</p>
                                    <p className="text-sm text-gray-500">Order ID: <span className="font-mono">OD-{order.orderId || order.id}</span></p>
                                    <p className="text-sm text-gray-500">Status: <span className="font-semibold text-blue-600">{order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/_/g, ' ')}</span></p>
                                </div>

                                {/* Right Side: Price and Actions */}
                                <div className="text-right">
                                    <p className="text-xl font-bold text-purple-600 mb-2">₹ {order.total_amount ? (order.total_amount + 50).toFixed(2) : 'N/A'}</p>
                                    <button onClick={() => navigate(`/home-grocery/invoice/${order.orderId}`)} className="text-sm font-medium text-purple-600 hover:underline">View Invoice</button>
                                    <br />
                                    <button onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)} className="text-sm font-medium text-gray-600 hover:underline mt-1">
                                        {expandedOrder === order.orderId ? 'Hide Details' : 'View Details'}
                                    </button>
                                </div>
                            </div>

                            {/* Collapsible Details Section */}
                            {expandedOrder === order.orderId && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <OrderStatusTimeline status={order.status} orderDate={order.date} />
                                    
                                    <h4 className='font-bold text-md mt-4 mb-2'>Items in this order:</h4>
                                    {order.items && order.items.map(item => (
                                        <div key={item.id} className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4"/>
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                    <p className="text-sm text-gray-600">Price: ₹{item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleBuyAgain(item)} className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full hover:bg-purple-200 transition">
                                                Buy Again
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
