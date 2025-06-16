import React, { useState, useEffect } from 'react';
import Header from "../SubPages/Header";
import shirt from "../Images/shirt.svg";
import Footer from '../SubPages/Footer';
import filter from "../Images/filterbutton.svg";
import { useNavigate } from 'react-router-dom';
import filterColor from "../Images/filtertcolorButton.svg";

function Myorders() {
    const navigate = useNavigate();
    const steps = ["Process", "Packaged", "Out of delivered", "Received"];
    const [orders, setOrders] = useState([]); // State to hold orders
    const [isOpen, setIsOpen] = useState({}); // Use object to manage multiple open states
    const [isOpenFilter, setIsOpenFilter] = useState(false);

    // Load orders from localStorage on component mount
    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('Gorders')) || [];
        setOrders(storedOrders);
    }, []);

    // Listen for storage changes from other components (e.g., when an order is placed)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'Gorders') {
                setOrders(JSON.parse(e.newValue) || []);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleOrderDetails = (orderId) => {
        setIsOpen(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    return (
        <div>
            <div className='bg-[#F8F8F8] min-h-screen'>
                <Header />
                <div className='px-4 pt-24 pb-28 bg-[#F8F8F8]'>
                    <div className="flex justify-between items-center w-full bg-[#F8F8F8]">
                        <p className='font-medium text-base text-[#484848]'>Your Orders</p>
                        <img src={filter} alt="filter" className="w-[60px] h-[30px]" onClick={() => setIsOpenFilter(true)} />
                    </div>
                    {orders.length > 0 ? ( // Conditionally render if there are orders
                        orders.map(order => (
                            <div key={order.orderId} className="bg-white border border-[#E1E1E1] rounded-[20px] mt-4 p-4 cursor-pointer"
                                 onClick={() => toggleOrderDetails(order.orderId)}>
                                <div className="flex row gap-4">
                                    <div className="w-[120px] h-[140px]">
                                        {/* Display the first item's image as a preview */}
                                        {order.items.length > 0 && (
                                            <img src={order.items[0].image} alt="product" className="w-full h-full p-4" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center w-full">
                                            <p className="text-[#5C3FFF] font-medium text-base">OD-{order.orderId}</p>
                                            <p className="font-medium text-base text-[#5C3FFF] text-right">Invoice</p>
                                        </div>
                                        <div className="font-semibold text-base text-[#242424] pt-2">{order.items.map(item => item.name).join(', ')}</div>
                                        <p className="font-medium text-sm text-[#242424] mb-2">
                                            ₹ {order.totalDiscountedPrice.toFixed(2)} <span className="line-through text-[#C1C1C1]">₹ {order.totalOriginalPrice.toFixed(2)}</span>
                                        </p>
                                        <div className="text-[#F3A91F] font-medium font-base">{order.status}</div>
                                    </div>
                                </div>
                                {isOpen[order.orderId] && ( // Show details if expanded
                                    <div className="mt-4 flex flex-col relative gap-2">
                                        {/* Iterate through actual steps instead of static steps */}
                                        {order.orderHistory.map((historyItem, index) => (
                                            <div key={index} className="flex items-start gap-3 relative">
                                                {/* Vertical Line (Behind Dots) */}
                                                {index !== order.orderHistory.length - 1 && (
                                                    <div
                                                        className={`absolute left-[5px] top-3 w-0.5 h-full 
                                                         ${historyItem.status === order.status ? "bg-[#5C3FFF]" : "bg-gray-300"}`}
                                                    ></div>
                                                )}

                                                {/* Step Icon */}
                                                <div className="relative z-10">
                                                    <div
                                                        className={`w-3 h-3 rounded-full border-2 
                                                         ${historyItem.status === order.status
                                                                ? "bg-[#5C3FFF] border-[#5C3FFF]"
                                                                : "bg-gray-300 border-gray-300"
                                                            }`}
                                                    ></div>
                                                </div>

                                                {/* Step Text */}
                                                <span
                                                    className={`text-sm ${historyItem.status === order.status ? "text-black font-medium" : "text-gray-500"}
                                                        `}
                                                >
                                                    {historyItem.status} - {new Date(historyItem.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                        {/* Display all items in the order */}
                                        <div className="mt-4 border-t pt-4">
                                            <p className="font-semibold text-base mb-2">Items in this Order:</p>
                                            {order.items.map(item => (
                                                <div key={`${item.category}-${item.id}`} className="flex items-center gap-2 mb-2">
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                                    <p className="text-sm text-gray-800">{item.name} (Qty: {item.quantity})</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No orders placed yet.
                        </div>
                    )}
                </div>
                <Footer />
            </div>
            {isOpenFilter && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50"
                    onClick={() => setIsOpenFilter(false)} // Close when clicking outside
                >
                    <div
                        className="bg-[#F8F8F8] w-[80%] h-full flex flex-col p-5 shadow-xl ml-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <div className="flex">
                            <img src={filterColor} alt="" style={{ width: "70px", height: "40px" }} className='ml-auto' />
                        </div>

                        <div className="flex-1 pt-8 px-2 overflow-auto">
                            {/* Filters */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                                />
                                <div className="text-sm font-semibold">Delivered</div>
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                                />
                                <div className="text-sm font-semibold">Not yet shipped</div>
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                                />
                                <div className="text-sm font-semibold">Cancelled</div>
                            </div>

                            <div className="text-[#797979] text-sm font-medium mt-8">
                                Filtered by date
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                                />
                                <div className="text-sm font-semibold">Last 30 days</div>
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                                />
                                <div className="text-sm font-semibold">Last 3 months</div>
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                                />
                                <div className="text-sm font-semibold">2023</div>
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                                />
                                <div className="text-sm font-semibold">2022</div>
                            </div>
                        </div>

                        {/* Buttons aligned at bottom */}
                        <div className="px-2 py-4">
                            <button className="w-full px-4 py-2 bg-[#5C3FFF] text-white rounded-[50px]" onClick={() => setIsOpenFilter(false)}>Apply</button>
                            <button className="text-[#242424] w-full px-4 py-2 border rounded-[50px] bg-[#EEEAFF] mt-2" onClick={() => setIsOpenFilter(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
export default Myorders;
