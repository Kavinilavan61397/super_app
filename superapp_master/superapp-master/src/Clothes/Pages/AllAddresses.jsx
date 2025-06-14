import React from 'react';
import { useState } from "react";
import ClothesHeader from "../Header/ClothesHeader";
import step1 from "../Images/step1.svg";
import gps from "../Images/gps.svg";
import { useNavigate } from 'react-router-dom';
import plus from "../../Icons/plus.svg";
import edit from "../../Icons/editicon.svg";

function AllAddresses() {
    const [selected, setSelected] = useState("Home");

    const buttons = ["Home", "Office", "Others"];
    const navigate = useNavigate();
    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <ClothesHeader />
            <div className='border border-[#E1E1E1] py-4'>
                <img src={step1} alt="" className='w-full mt-20 px-6' />
            </div >
            <div className="flex justify-between items-center px-4 pt-2">
                <h2 className="text-base font-medium">Delivery address</h2>
                <div className="flex items-center gap-2">
                    <img src={plus} alt="plus" className="cursor-pointer w-8 h-8" onClick={() => navigate('/home-clothes/address')} />
                </div>

            </div>
            <div className=' mt-2 px-4 pb-16'>
                <div className=" bg-[#FBFBFB] border border-[#5C3FFF] rounded-[20px] p-1 flex flex-col justify-between h-full"
                onClick={() => navigate('/home-clothes/product-detail')}   
                >
                    <div className=" mt-2 p-2 rounded-lg" >
                        <div className="flex justify-between items-center w-full">
                            <div>
                                Breeza Quiz,
                                <span className="bg-[#544C4A] px-2 py-1 rounded-full text-white font-normal text-sm ml-2">
                                    Home
                                </span>
                            </div>
                        </div>

                        <div className="mt-2">
                            No 172, Mountain city cross,<br />
                            Texas,<br />
                            USA -23204
                        </div>
                    </div>

                </div>
                <div>
                </div>
                <div className="mt-3 bg-white border border-gray-300 rounded-[20px] p-1 flex flex-col justify-between h-full">
                    <div className=" mt-2 p-2 rounded-lg" >
                        <div className="flex justify-between items-center w-full">
                            <div>
                                Breeza Quiz,
                                <span className="bg-[#544C4A] px-2 py-1 rounded-full text-white font-normal text-sm ml-2">
                                    Home
                                </span>
                            </div>
                        </div>

                        <div className="mt-2">
                            No 172, Mountain city cross,<br />
                            Texas,<br />
                            USA -23204
                        </div>
                    </div>

                   
                </div>
                <div>
                </div>

            </div>
        </div>
    )
}

export default AllAddresses;