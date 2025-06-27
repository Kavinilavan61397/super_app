import React, { useState, useEffect } from 'react';
import ClothesHeader from "../Header/ClothesHeader";
import Footer from '../../Utility/Footer';
import filter from "../Images/filterbutton.svg";
//import { useNavigate } from 'react-router-dom';
import filterColor from "../Images/filtertcolorButton.svg";

function Myorders() {
    //const navigate = useNavigate();
    const steps = ["Process", "Packaged", "Out of delivered", "Received"];
    const currentStep = 0;
    //const [isOpen, setIsOpen] = useState(false);
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        setOrders(storedOrders);
    }, []);

    return (
        <div>
            <div className='bg-[#F8F8F8] min-h-screen'>
                <ClothesHeader />
                <div className='px-4 pt-24 pb-28 bg-[#F8F8F8]'>
                    <div className="flex justify-between items-center w-full bg-[#F8F8F8]">
                        <p className='font-medium text-base text-[#484848]'>Your Orders</p>
                        <img src={filter} alt="filter" className="w-[60px] h-[30px]" onClick={() => setIsOpenFilter(true)} />
                    </div>
                    {orders.length === 0 ? (
                        <div className="flex items-center justify-center h-[50vh] text-center text-[#484848] text-lg">No orders yet.</div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white border border-[#E1E1E1] rounded-[20px] mt-4 p-4 cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                                <div className="flex row gap-4">
                                    <div className="w-[120px] h-[140px]">
                                        <img src={order.items[0]?.image} alt="product" className="w-full h-full p-4" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center w-full">
                                            <p className="text-[#5C3FFF] font-medium text-base">OD-{order.id}</p>
                                            <p className="font-medium text-base text-[#5C3FFF]">Invoice</p>
                                        </div>
                                        <div className="font-semibold text-base text-[#242424] pt-2">{order.items[0]?.name} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}</div>
                                        <p className="font-medium text-sm text-[#242424] mb-2">
                                            ₹ {order.items.reduce((sum, item) => sum + (parseFloat(item.discountedPrice) * item.quantity), 0)}
                                        </p>
                                        <div className="text-[#F3A91F] font-medium font-base">{order.status}</div>
                                    </div>
                                </div>
                                {expandedOrderId === order.id && (
                                    <div className="mt-4 flex flex-col relative gap-2">
                                        <div className="mb-2 font-semibold text-sm text-[#484848]">Order Items:</div>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 border-b py-2">
                                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{item.name}</div>
                                                    <div className="text-xs text-[#797979]">Size: {item.size}</div>
                                                    <div className="text-xs text-[#797979]">Qty: {item.quantity}</div>
                                                </div>
                                                <div className="font-medium text-sm">₹ {parseFloat(item.discountedPrice) * item.quantity}</div>
                                            </div>
                                        ))}
                                        <div className="mt-2 text-xs text-[#797979]">Order Date: {new Date(order.date).toLocaleString()}</div>
                                        {/* Steps */}
                                        <div className="mt-4 flex flex-col relative gap-2">
                                            {steps.map((step, index) => (
                                                <div key={index} className="flex items-start gap-3 relative">
                                                    {/* Vertical Line (Behind Dots) */}
                                                    {index !== steps.length - 1 && (
                                                        <div
                                                            className={`absolute left-[5px] top-3 w-0.5 h-full 
                                         ${index < currentStep ? "bg-[#5C3FFF]" : "bg-gray-300"}`}
                                                        ></div>
                                                    )}

                                                    {/* Step Icon */}
                                                    <div className="relative z-10">
                                                        <div
                                                            className={`w-3 h-3 rounded-full border-2 
                                         ${index <= currentStep
                                                                ? "bg-[#5C3FFF] border-[#5C3FFF]"
                                                                : "bg-gray-300 border-gray-300"
                                                            }`}
                                                        ></div>
                                                    </div>

                                                    {/* Step Text */}
                                                    <span
                                                        className={`text-sm ${index <= currentStep ? "text-black font-medium" : "text-gray-500"
                                                            }`}
                                                    >
                                                        {step}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
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
