import React from 'react';
import step3 from "../../Clothes/Images/step3.svg";
import phonepay from "../../Clothes/Images/phonepay.svg";
import paytm from "../../Clothes/Images/paytm.svg";
import amazon from "../../Clothes/Images/amazonpay.svg";
import mobikwik from "../../Clothes/Images/mobikwik.svg";
import restricted from "../../Clothes/Images/mobikrestricted.svg";
import credit from "../../Clothes/Images/creditdebit.svg";
import hdfc from "../../Clothes/Images/hdfc.svg";
import icici from "../../Clothes/Images/icici.svg";
import sbi from "../../Clothes/Images/sbi.svg";
import axis from "../../Clothes/Images/axis.svg";
import kotak from "../../Clothes/Images/kotak.svg";
import cod from "../../Clothes/Images/COD.svg";
import { useNavigate } from 'react-router-dom';
import HeaderInsideFood from '../ComponentsF/HeaderInsideFood';

function PaymentFood() {
    const navigate = useNavigate();
    return (
        <div className='bg-[#F8F8F8] min-h-screen'>
            <HeaderInsideFood />
            <div className='border border-[#E1E1E1] py-4'>
                <img src={step3} alt="" className='w-full mt-20 px-6' />
            </div >
            <div className='px-4 pb-16'>
                <div className="bg-[#F1EDFF] flex justify-between items-center w-full rounded-full px-4 py-3 mt-4 border border-[#E7E7E7]">
                    <p className='font-medium text-base'>Total Amount</p>
                    <p className="font-medium text-base">
                        ₹ 1,100
                    </p>
                </div>
                <div className='text-[#242424] text-base font-medium mt-2'>Payment Type</div>

                <div className='bg-white border border-[#E1E1E1] rounded-[20px] p-6 mt-2' >
                    <div className='font-medium text-base'>Wallet</div>
                    <div className="flex justify-between items-center w-full mt-3">
                        <img className='' src={phonepay} alt="phonepay" />
                        <p className="font-medium text-sm text-[#5C3FFF]">
                            Link
                        </p>
                    </div>
                    <div className="flex justify-between items-center w-full mt-2">
                        <img className='' src={paytm} alt="paytm" />
                        <p className="font-medium text-sm text-[#5C3FFF]">
                            Link
                        </p>
                    </div>
                    <div className="flex justify-between items-center w-full mt-2">
                        <img className='' src={amazon} alt="amazon" />
                        <p className="font-medium text-sm text-[#5C3FFF]">
                            Link
                        </p>
                    </div>
                    <img className='mt-2' src={mobikwik} alt="mobikwik" />
                    <img className='' src={restricted} alt="restricted" />
                </div>

                <div className='bg-white border border-[#E1E1E1] rounded-[20px] p-6 mt-2' >
                    <div className='font-medium text-base'>Cards</div>
                    <img src={credit} alt="credit" className='' />
                </div>

                <div className='bg-white border border-[#E1E1E1] rounded-[20px] p-6 mt-2' >
                    <div className='font-medium text-base'>Net Banking</div>
                    <div className="flex justify-between items-center w-full mt-3" >
                        <img className='' src={hdfc} alt="hdfc" />
                        <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                        />
                    </div>
                    <div className="flex justify-between items-center w-full mt-3">
                        <img className='' src={icici} alt="icici" />
                        <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                        />
                    </div>
                    <div className="flex justify-between items-center w-full mt-3">
                        <img className='' src={sbi} alt="sbi" />
                        <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                        />
                    </div>
                    <div className="flex justify-between items-center w-full mt-3">
                        <img className='' src={axis} alt="axis" />
                        <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                        />
                    </div>
                    <div className="flex justify-between items-center w-full mt-3">
                        <img className='' src={kotak} alt="kotak" />
                        <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                        />
                    </div>

                </div>

                <div className='bg-white border border-[#E1E1E1] rounded-[20px] p-6 mt-2' >
                    <div className='font-medium text-base'>Pay on Delivery</div>
                    <div className="flex justify-between items-center w-full mt-3">
                        <img className='' src={cod} alt="cod" />
                        <input
                            type="checkbox"
                            className="w-4 h-4 border-2 border-[#5C3FFF] rounded-full appearance-none checked:bg-[#5C3FFF] checked:border-[#5C3FFF]"
                        />
                    </div>
                </div>

                <button
                    onClick={() => navigate("/home-food/order-placed")}
                    className="w-full px-4 py-2 bg-[#5C3FFF] text-white rounded-[50px] mt-6" >
                    Make Payment
                </button>
            </div>
        </div>
    );
}

export default PaymentFood;