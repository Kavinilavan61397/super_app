import React from 'react';
import logo from "../Images/Logo/E-STORE.svg";
import { useNavigate } from 'react-router-dom';
// import frame from "../Images/Auth/Frame.svg"

function Register() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen flex flex-col items-center justify-start">
            {/* Gradient Background */}
            <div className="w-full h-40 bg-gradient-to-b from-[#d6a1ef] to-white "></div>
            {/* <img src={frame} alt="frame" className="w-full h-32 rounded-b-3xl" /> */}
            {/* Logo */}


            {/* Form Fields */}
            <div className="w-full max-w-sm px-4 py-8 bg-white flex flex-col items-center">
                <img src={logo} alt='E-STORE' className="w-32 mt-4" />
                <label className="mt-4 block text-sm text-gray-600 w-full">Enter your name</label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                />

                <label className="mt-4 block text-sm text-gray-600 w-full">Enter your email ID</label>
                <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                />

                <label className="mt-4 block text-sm text-gray-600 w-full">Enter your mobile number</label>
                <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                />

                <div className="w-full text-right mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <span
                            className="text-[#5C3FFF] cursor-pointer"
                            onClick={() => navigate('/login')}
                        >
                            Sign in here
                        </span>
                    </p>
                </div>
            </div>


            <div className='fixed left-0 right-0 bottom-16 px-4'>
                <button
                    onClick={() => navigate('/otp')}
                    className="w-full max-w-sm mt-6 h-12 bg-[#5C3FFF] text-white text-lg font-semibold rounded-full flex items-center justify-center transition duration-300 hover:bg-[#4A2FCC] hover:scale-105 active:scale-95">
                    Continue
                </button>
            </div>
        </div>
    );
}

export default Register;
