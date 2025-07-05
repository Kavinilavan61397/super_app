import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../Images/Logo/E-STORE.svg";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.email || !formData.phone || !formData.otp) {
            setError('Please fill in all fields');
            return;
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        if (!/^\d{6}$/.test(formData.otp)) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Mock registration success for now
            alert('Registration successful!');
            navigate('/home');
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred while trying to register. Please try again.');
        } finally {
            setLoading(false);
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

                {/* Error Message */}
                {error && (
                    <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="w-full">
                    {/* Email Field */}
                    <label className="block text-sm text-gray-600 w-full mt-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1 text-base"
                        disabled={loading}
                    />

                    {/* Phone Field */}
                    <label className="block text-sm text-gray-600 w-full mt-4">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength="10"
                        className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1 text-base"
                        disabled={loading}
                    />

                    {/* OTP Field */}
                    <label className="block text-sm text-gray-600 w-full mt-4">Enter OTP</label>
                    <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        maxLength="6"
                        className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1 text-base"
                        disabled={loading}
                    />

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[#5C3FFF] text-white text-lg font-semibold rounded-full flex items-center justify-center transition duration-300 hover:bg-[#4A2FCC] hover:scale-105 active:scale-95 mt-6 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-4 text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <button 
                        onClick={() => navigate('/home')}
                        className="text-[#5C3FFF] hover:underline font-medium"
                    > 
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
