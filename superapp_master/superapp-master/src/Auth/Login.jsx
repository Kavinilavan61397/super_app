import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../Images/Logo/E-STORE.svg";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const handleLogin = () => {
        if (email && phone && otp) {
            alert('Login successful!');
            navigate('/home');
        } else {
            alert('Please fill all the fields');
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white relative px-2 py-6 sm:px-0">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#d6a1ef] to-white z-0"></div>

            {/* Centered Form Container */}
            <div className="w-full max-w-sm px-4 py-8 bg-white flex flex-col items-center rounded-xl shadow-lg z-10 relative mt-8 mb-8 sm:mt-0 sm:mb-0">
                {/* Logo */}
                <img src={logo} alt="E-STORE" className="w-24 sm:w-32 mb-6" />

                {/* Email Field */}
                <label className="block text-sm text-gray-600 w-full mt-2">Enter your email ID</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1 text-base"
                />

                {/* Phone Number Field */}
                <label className="block text-sm text-gray-600 w-full mt-4">Enter your phone number</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) setPhone(val); // Only digits
                    }}
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1 text-base"
                />

                {/* OTP Field */}
                <label className="block text-sm text-gray-600 w-full mt-4">Enter your OTP</label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) setOtp(val); // Only digits
                    }}
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1 text-base"
                />

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    className="w-full h-12 bg-[#5C3FFF] text-white text-lg font-semibold rounded-full flex items-center justify-center transition duration-300 hover:bg-[#4A2FCC] hover:scale-105 active:scale-95 mt-6 mb-2"
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;