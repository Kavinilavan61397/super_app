import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { authService } from "../../services/authService";
import logo from "../../assets/img/logo/android-chrome-512x512.png";
import API_CONFIG from "../../config/api.config";

export default function SignIn() {
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await authService.login(data);
      
      if (response.success) {
        // Check if there's a saved redirect URL
        const redirectUrl = sessionStorage.getItem('redirectUrl');
        sessionStorage.removeItem('redirectUrl'); // Clear it after use
        
        // Navigate to the saved URL or default dashboard
        navigate(redirectUrl || API_CONFIG.ROUTES.DASHBOARD);
      } else {
        setServerError(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError(
        error.message || 
        "An error occurred while trying to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your email and password to sign in!
          </p>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-600`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <input
                type="password"
                {...register("password")}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-600`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="p-4 rounded-lg bg-red-50 text-sm text-red-600">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white text-lg font-medium 
                bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to={API_CONFIG.ROUTES.SIGNUP} className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Background Image/Design */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-purple-600 to-blue-500">
        <div className="h-full flex flex-col justify-center items-center text-white p-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg mb-8">Sign in to access your admin dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
