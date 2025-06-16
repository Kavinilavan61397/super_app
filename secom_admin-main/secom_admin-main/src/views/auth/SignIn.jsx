import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import logo from "../../assets/img/logo/android-chrome-512x512.png";

export default function SignIn() {
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters.")
      .required("Password is required"),
  });

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("OnlineShop-accessToken", responseData.access_token);
        localStorage.setItem("OnlineShop-tokenExpiration", Date.now() + responseData.expires_in * 1000);
        navigate("/admin/default");
      } else {
        setServerError(responseData.message || "Login failed");
      }
    } catch (error) {
      setServerError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-2 md:px-0">
      <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-navy-800">
          <div className="mb-8 flex justify-center">
            <img src={logo} alt="Logo" className="w-24 h-auto" />
          </div>
          <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white text-center">
            Sign In
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Enter your email and password to sign in!
          </p>

          <form onSubmit={handleSubmit(handleSignIn)}>
            <div className="mb-3">
              <label htmlFor="email" className="block text-sm font-semibold mb-1">Email*</label>
              <input
                type="text"
                id="email"
                {...register("email")}
                placeholder="Enter Email"
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="block text-sm font-semibold mb-1">Password*</label>
              <input
                type="password"
                id="password"
                {...register("password")}
                placeholder="Enter Password"
                className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {serverError && <p className="mb-4 text-sm text-red-500">{serverError}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`relative mt-2 w-full h-12 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
