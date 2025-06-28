import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../../Images/Logo/E-STORE.svg'; // Assuming you have a logo

function Invoice() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null); // Combined state for all invoice data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndPrepareData = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication required.');
                navigate('/login');
                return;
            }

            try {
                // 1. Fetch Order Details from API
                const response = await fetch(`http://localhost:5000/api/gorders/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch order details.');
                }
                const order = await response.json();

                // 2. Get Profile and Address from localStorage
                const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                const storedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
                const defaultAddress = Array.isArray(storedAddresses) && storedAddresses.length > 0
                    ? storedAddresses[0]
                    : null;
                
                // 3. Combine all data into a single state object
                setOrderData({
                    order,
                    profile: storedProfile,
                    address: defaultAddress
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAndPrepareData();
    }, [orderId, navigate]);
    
    // Function to handle printing
    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-8 text-center">Loading Invoice...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (!orderData) return <div className="p-8 text-center">Order data could not be loaded.</div>;

    // Destructure for easier access in JSX
    const { order, profile, address } = orderData;

    // --- Calculations ---
    const subtotal = order.items?.reduce((sum, item) => sum + (parseFloat(item.discounted_price) * item.quantity), 0) || 0;
    const deliveryFee = 50; // Example fee
    const total = subtotal + deliveryFee;

    return (
        <>
            <style>{`
                @media print { .no-print { display: none !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            `}</style>

            {/* Use a container that makes sense for a mobile view */}
            <div className="w-full max-w-md mx-auto bg-white min-h-screen font-sans">
                
                {/* Invoice Body */}
                <div className="p-6 pb-24"> {/* Padding at bottom to avoid overlap with fixed buttons */}
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-purple-600 tracking-tighter">E-STORE</h1>
                            <p className="text-xl font-semibold text-gray-700 mt-1">Invoice</p>
                        </div>
                        <div className="text-right text-xs text-gray-600 space-y-0.5">
                            <p><span className="font-bold">Invoice #:</span> OD-{order.id}</p>
                            <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>
                            <div className="mt-1"><span className="font-bold">Status:</span> 
                                <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">
                                    {(order.payment_status || 'pending').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Billed To / Shipping */}
                    <div className="grid grid-cols-2 gap-4 text-xs mb-8">
                        <div>
                            <h2 className="font-bold text-gray-800 mb-1 uppercase tracking-wide">Billed To</h2>
                            <p className="text-gray-600">{profile?.fullName || order.User?.name || 'Valued Customer'}</p>
                            <p className="text-gray-600">{profile?.emailId || order.User?.email || 'No Email Provided'}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="font-bold text-gray-800 mb-1 uppercase tracking-wide">Shipping To</h2>
                            {address ? (
                                <address className="text-gray-600 not-italic">
                                    {address.houseNo}, {address.roadName}<br />
                                    {address.city}, {address.state} {address.pincode}
                                </address>
                            ) : (
                                <p className="text-gray-600">{order.shipping_address || 'Default Address'}</p>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full text-sm mb-8">
                        <thead>
                            <tr className="border-b-2 border-gray-300 text-gray-700">
                                <th className="text-left font-semibold pb-2">ITEM</th>
                                <th className="text-center font-semibold pb-2">QTY</th>
                                <th className="text-right font-semibold pb-2">PRICE</th>
                                <th className="text-right font-semibold pb-2">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map(item => (
                                <tr key={item.id} className="border-b border-gray-200">
                                    <td className="py-2.5">{item.name}</td>
                                    <td className="py-2.5 text-center">{item.quantity}</td>
                                    <td className="py-2.5 text-right">₹{parseFloat(item.discounted_price).toFixed(2)}</td>
                                    <td className="py-2.5 text-right font-medium">₹{(item.quantity * parseFloat(item.discounted_price)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end text-sm">
                        <div className="w-48 space-y-1">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 border-t-2 border-gray-300 mt-2 pt-2">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="text-center text-xs text-gray-500 mt-12">
                        <p className="font-semibold">Thank you for your business!</p>
                        <p>Superapp | customer@superapp.in</p>
                    </div>
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 flex gap-3 no-print">
                <button onClick={() => navigate(-1)} className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 active:bg-gray-400 transition">
                    Back
                </button>
                <button onClick={handlePrint} className="w-full py-3 bg-[#5C3FFF] text-white rounded-lg font-semibold hover:bg-[#4a32cc] active:bg-[#40289f] transition">
                    Print / Save as PDF
                </button>
            </div>
        </>
    );
}

export default Invoice; 