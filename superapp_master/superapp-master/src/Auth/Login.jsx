// Login component temporarily disabled
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authService } from '../services/authService';
// import logo from "../Images/Logo/E-STORE.svg";

// function Login() {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
        
//         if (!formData.email || !formData.password) {
//             setError('Please fill in all fields');
//             return;
//         }

//         setLoading(true);
//         setError('');

//         try {
//             const response = await authService.login(formData);
            
//             if (response.success) {
//                 // Check if there's a saved redirect URL
//                 const redirectUrl = sessionStorage.getItem('redirectUrl');
//                 sessionStorage.removeItem('redirectUrl'); // Clear it after use
                
//                 // Navigate to the saved URL or default home page
//                 navigate(redirectUrl || '/home');
//             } else {
//                 setError(response.message || 'Login failed. Please try again.');
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             setError('An error occurred while trying to sign in. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white relative px-2 py-6 sm:px-0">
//             {/* Gradient Background */}
//             <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#d6a1ef] to-white z-0"></div>

//             {/* Centered Form Container */}
//             <div className="w-full max-w-sm px-4 py-8 bg-white flex flex-col items-center rounded-xl shadow-lg z-10 relative mt-8 mb-8 sm:mt-0 sm:mb-0">
//                 {/* Logo */}
//                 <img src={logo} alt="E-STORE" className="w-24 sm:w-32 mb-6" />

//                 {/* Error Message */}
//                 {error && (
//                     <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleLogin} className="w-full">
//                     {/* Email Field */}
//                     <label className="block text-sm text-gray-600 w-full mt-2">Enter your email ID</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1 text-base"
//                         disabled={loading}
//                     />

//                     {/* Password Field */}
//                     <label className="block text-sm text-gray-600 w-full mt-4">Enter your password</label>
//                     <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleInputChange}
//                         className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C3FFF] mt-1 text-base"
//                         disabled={loading}
//                     />

//                     {/* Login Button */}
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full h-12 bg-[#5C3FFF] text-white text-lg font-semibold rounded-full flex items-center justify-center transition duration-300 hover:bg-[#4A2FCC] hover:scale-105 active:scale-95 mt-6 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {loading ? 'Signing in...' : 'Login'}
//                     </button>
//                 </form>

//                 {/* Register Link */}
//                 <div className="mt-4 text-center">
//                     <span className="text-gray-600">Don't have an account? </span>
//                     <button 
//                         onClick={() => navigate('/register')}
//                         className="text-[#5C3FFF] hover:underline font-medium"
//                     >
//                         Register here
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;