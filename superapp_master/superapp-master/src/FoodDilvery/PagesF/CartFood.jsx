import React from 'react';
import shirt from "../ImagesF/noodles.svg";
import deletee from "../../Clothes/Images/delete.svg";
import HeaderF from "../ComponentsF/HeaderF";
import FooterFood from '../ComponentsF/FooterFood';
import { useNavigate } from 'react-router-dom';

function CartFood() {
    const navigate = useNavigate();
    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <HeaderF />
            <div className='px-4 pt-24'>
                <div className='font-medium text-base'>My Carts</div>
                <div className='bg-white border border-[#E1E1E1] rounded-[20px] mt-4 flex row gap-4 p-4'>
                    <div className='w-[120px] h-[140px]'>
                        <img src={shirt} alt="product" className='w-full h-full p-4' />
                    </div>
                    <div>
                        <div className='font-semibold text-base text-[#242424] pt-4'>Chicken Tikka Delight Pizza</div>
                        <p className="font-medium text-sm text-[#242424] mb-2">₹ 1,400 <span className="line-through text-[#C1C1C1]">₹ 1,500</span></p>
                        <div className="flex justify-between items-center  w-full">
                            <select className=" py-0 rounded-full border border-[#CCCCCC] px-3">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </select>
                            <img src={deletee} alt="product" className='w-full h-full' style={{ width: "24px", height: "24px" }} />
                        </div>
                    </div>
                </div>
                <div className='bg-white border border-[#E1E1E1] rounded-[20px] mt-4 flex row gap-4 p-4'>
                    <div className='w-[120px] h-[140px]'>
                        <img src={shirt} alt="product" className='w-full h-full p-4' />
                    </div>
                    <div>
                        <div className='font-semibold text-base text-[#242424] pt-4'>Chicken Tikka Delight Pizza</div>
                        <p className="font-medium text-sm text-[#242424] mb-2">₹ 1,400 <span className="line-through text-[#C1C1C1]">₹ 1,500</span></p>

                        <div className="flex justify-between items-center  w-full">
                            <select className=" py-0 rounded-full border border-[#CCCCCC] px-3">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </select>
                            <img src={deletee} alt="product" className='w-full h-full' style={{ width: "24px", height: "24px" }} />
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-24 left-0 w-full px-4 py-4">
                    <button
                        onClick={() => navigate("/home-food/choose-address")}
                        className="w-full px-4 py-2 bg-[#5C3FFF] text-white rounded-[50px]">
                        Processed to Pay
                    </button>
                </div>
            </div>
            <FooterFood />
        </div>
    )
}
export default CartFood;