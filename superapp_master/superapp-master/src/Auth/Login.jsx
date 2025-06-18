import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import logo from "../Images/Logo/E-STORE.svg";

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login successful!');
                localStorage.setItem('token', data.data.token);
                navigate('/home'); 
            } else {
                alert(data.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Something went wrong during login. Please try again later.');
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            {/* Gradient Background */}
            <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-[#d6a1ef] to-white"></div>

            {/* Centered Form Container */}
            <div className="w-full max-w-sm px-4 py-8 bg-white flex flex-col items-center">
                {/* Logo */}
                <img src={logo} alt="E-STORE" className="w-32 mb-6" />

                {/* Email Field */}
                <label className="block text-sm text-gray-600 w-full">Enter your email ID</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                />

                {/* Password Field */}
                <label className="block text-sm text-gray-600 w-full mt-4">Enter your password</label>
                <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1"
                    />
                    <span
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                    </span>
                </div>

                {/* Signup Link */}
                <div className="w-full text-right mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <span
                            className="text-[#5C3FFF] cursor-pointer"
                            onClick={() => navigate('/register')}
                        >
                            Sign up here
                        </span>
                    </p>
                </div>
            </div>

            {/* Continue Button */}
            <div className="fixed left-0 right-0 bottom-16 px-4 flex justify-center">
                <button
                    onClick={handleLogin}
                    className="w-full max-w-sm h-12 bg-[#5C3FFF] text-white text-lg font-semibold rounded-full flex items-center justify-center transition duration-300 hover:bg-[#4A2FCC] hover:scale-105 active:scale-95"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default Login;
