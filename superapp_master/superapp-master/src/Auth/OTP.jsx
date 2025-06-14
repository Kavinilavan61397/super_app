import React from 'react';
import logo from "../Images/Logo/E-STORE.svg";
import { useNavigate } from 'react-router-dom';

function OTP() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen flex flex-col items-center justify-start ">
            {/* Gradient Background */}
            <div className="w-full h-40 bg-gradient-to-b from-[#d6a1ef] to-white "></div>

            <div className="w-full max-w-sm px-4 py-8 bg-white flex flex-col items-center">
                {/* Logo */}
                <img src={logo} alt='E-STORE' className="w-32 mt-4" />

                {/* OTP Instruction */}
                <p className="text-sm text-gray-600 text-left mt-6">
                    Please enter the verification code we've sent to your <br />
                    Mobile Number <span className="text-[#5C3FFF]">+91 98745 63200</span>
                </p>

                {/* OTP Input Fields */}
                <div className="flex space-x-2 mt-4">
                    {Array(4).fill(0).map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C3FFF]"
                        />
                    ))}
                </div>

                {/* Resend OTP */}

                <div className="w-full text-right mt-4">
                    <p className="text-sm text-[#5C3FFF] cursor-pointer">
                        Resend Again{" "}

                    </p>
                </div>
            </div>
            {/* Confirm Button */}
            <div className='fixed left-0 right-0 bottom-16 px-4'>
                <button
                    onClick={() => navigate('/set-password')}
                    className="w-full max-w-sm mt-6 h-12 bg-[#5C3FFF] text-white text-lg font-semibold rounded-full flex items-center justify-center transition duration-300 hover:bg-[#4A2FCC] hover:scale-105 active:scale-95">
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default OTP;