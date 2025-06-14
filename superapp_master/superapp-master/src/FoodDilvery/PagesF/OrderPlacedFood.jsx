import React from 'react';
import step4 from "../../Clothes/Images/step4.svg";
import right from "../../Clothes/Images/successful.gif";
import noodels from "../ImagesF/noodles.svg";
import { useNavigate } from 'react-router-dom';
import HeaderInsideFood from '../ComponentsF/HeaderInsideFood';

function OrderPlacedFood() {
    const navigate = useNavigate();
    return (
        <div className='bg-[#F8F8F8] min-h-screen flex flex-col items-center '>
            <HeaderInsideFood />

            <div className='border border-[#E1E1E1] py-4 w-full flex justify-center'>
                <img src={step4} alt="" className='w-full max-w-md mt-20 px-6' />
            </div>
            {/* Centering the image and text */}
            <div className="flex flex-col justify-center items-center mt-2">
                <img src={right} alt="" className='' />
                <div className='text-lg font-bold mt-0 text-center'>
                    Your order has been placed!
                </div>
            </div>
            <div className='px-4'>
                <div className='bg-white border border-[#E1E1E1] rounded-[20px] mt-4 flex row gap-4 p-4'>
                    <div className='w-[120px] h-[140px]'>
                        <img src={noodels} alt="product" className='w-full h-full p-4' />
                    </div>
                    <div>
                        {/* <div className="flex justify-between items-center  w-full">
                        <p className="text-[#5C3FFF] font-medium text-base">OD-1223</p>
                        <p className="font-medium text-base text-[#5C3FFF]">Invoice</p>
                        </div> */}
                        <div className='font-semibold text-base text-[#242424] pt-4'>Chicken Tikka Delight Pizza</div>
                        <p className="font-medium text-sm text-[#242424] mb-2">₹ 1,400 </p>
                        <div className="text-[#18A20C] font-medium font-base">
                            Preparing
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/home-food/food-order-tracking')}
                    className="mt-2 text-base font-medium text-[#5C3FFF] underline text-center">
                    Track Order
                </div>
                <div
                    onClick={() => navigate('/home-food/orders-history')}
                    className="mt-2 text-base font-medium text-[#5C3FFF] underline text-center">
                    Check your order list
                </div>
            </div>
        </div>
    )
}

export default OrderPlacedFood;
