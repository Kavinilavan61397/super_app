import React, { useState } from 'react';
import noodels from "../ImagesF/noodles.svg";
import filter from "../../Clothes/Images/filterbutton.svg";
import { useNavigate } from 'react-router-dom';
import filterColor from "../../Clothes/Images/filtertcolorButton.svg";
import HeaderInsideFood from '../ComponentsF/HeaderInsideFood';
import FooterFood from '../ComponentsF/FooterFood';
import cross from "../../Icons/close-circle.svg";

function OrdersHistoryFood() {
    const navigate = useNavigate();
    const steps = ["Process", "Packaged", "Out of delivered", "Received"];
    const currentStep = 3;
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    return (
        <div>
            <div className='bg-[#F8F8F8] min-h-screen'>
                <HeaderInsideFood />
                <div className='px-4 pt-24 pb-28 bg-[#F8F8F8]'>
                    <div className="flex justify-between items-center w-full bg-[#F8F8F8]">
                        <p className='font-medium text-base text-[#484848]'>Your Orders</p>
                        <img src={filter} alt="filter" className="w-[60px] h-[30px]" onClick={() => setIsOpenFilter(true)} />
                    </div>
                    <div className="bg-white border border-[#E1E1E1] rounded-[20px] mt-4 p-4 cursor-pointer" >
                        <div className="flex row gap-4">
                            <div className="w-[120px] h-[140px]">
                                <img src={noodels} alt="product" className="w-full h-full p-4" />
                            </div>
                            <div className='pt-1'>
                                <div className="flex justify-between items-center w-full">

                                    <p className="text-[#5C3FFF] font-medium text-base">OD-1223</p>
                                    <p
                                        className="font-medium text-base text-[#5C3FFF]  cursor-pointer flex items-center gap-1"
                                        onClick={() => setIsInvoiceOpen(true)}
                                    >
                                        <span className="font-base border border-[#5C3FFF] rounded-full flex items-center justify-center w-4 h-4">
                                            i
                                        </span>
                                        Invoice
                                    </p>
                                </div>
                                <div className="font-semibold text-base text-[#242424]">Chicken Tikka Delight Pizza</div>
                                <p className="font-medium text-sm text-[#242424] mb-2">
                                    ₹ 1,400
                                </p>
                                <div className="text-[#359F1C] font-medium font-base" onClick={() => setIsOpen(!isOpen)}>Delivered</div>
                            </div>
                        </div>
                        {isOpen && (
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


                        )}
                    </div>
                </div>
                <FooterFood />
            </div>
            {isOpenFilter && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
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

            {isInvoiceOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
                    <div className="bg-white w-[90%] md:w-[50%] p-6 rounded-[20px] shadow-lg relative">
                        <img
                            src={cross}
                            alt="cross"
                            className="absolute top-2 right-2 cursor-pointer"
                            onClick={() => setIsInvoiceOpen(false)}
                        />
                        {/* Invoice Content */}
                        <table className="w-full mt-2">
                            <thead>
                                <tr className="text-[#242424] font-medium text-sm">
                                    <th className="text-left">Description</th>
                                    <th className="text-left pl-10">Qty</th>
                                    <th className="text-left">Price</th>
                                    <th className="text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { description: "✦ Pizza", qty: 5, price: 199, total: 995 },
                                    { description: "✦ Pizza", qty: 5, price: 199, total: 995 },
                                    { description: "✦ Pizza", qty: 5, price: 199, total: 995 }
                                ].map((item, index) => (
                                    <tr key={index} className="text-[#242424] font-normal text-sm">
                                        <td className="py-1">{item.description}</td>
                                        <td className="py-1 pl-10 text-center">{item.qty}</td>
                                        <td className="py-1 text-center">{item.price}</td>
                                        <td className="py-1 text-center">{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </div>
    );
}
export default OrdersHistoryFood;
