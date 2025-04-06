import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, User } from "lucide-react";

const Register = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  
  const handleRegister = async (data) => {
    data.phone = `+91${data.phone}`;
    setLoading(true);
    try {
      const res = await axios.post(
        `${apiUrl}/api/v1/user/register`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
  
      toast.success(res.data.message);
      
      // ✅ Ensure user is redirected to OTP verification page
      navigateTo(`/otp-verification/${data.email}/${data.phone}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false); // stop loading
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
            <User className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create an Account</h2>
        <p className="text-center text-gray-600 mb-8">Sign up to get started</p>
        
        <form onSubmit={handleSubmit((data) => handleRegister(data))}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              {...register("name")}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter Your Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              {...register("email")}
            />
          </div>
          
          {/* <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                +91
              </span>
              <input
                id="phone"
                type="number"
                placeholder="9876543210"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                {...register("phone")}
              />
            </div>
          </div> */}

<div className="mb-4">
  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
    Phone Number
  </label>
  <div className="flex">
    <span className="inline-flex items-center px-3 py-2 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
      +91
    </span>
    <input
      id="phone"
      type="text" // Use text to prevent auto-trim of leading zeros
      placeholder="Enter Your Phone Number"
      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      maxLength={10} // Prevents more than 10 characters
      {...register("phone", {
        required: "Phone number is required",
        pattern: {
          value: /^[0-9]{10}$/, // Ensures exactly 10 numeric digits
          message: "Phone number must be exactly 10 digits",
        },
      })}
      onInput={(e) => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
      }} // Restrict to numbers only & max 10 digits
    />
  </div>
  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
</div>

          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                {...register("password")}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Select Verification Method
            </p>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="email"
                  className="form-radio h-4 w-4 text-purple-600"
                  {...register("verificationMethod")}
                  required
                />
                <span className="ml-2 text-gray-700">Email</span>
              </label>
            </div>
          </div>
          
          <button
  type="submit"
  disabled={loading}
  className={`w-full py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
    loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
  }`}
>
  {loading ? 'Signing Up...' : 'Sign Up'}
</button>

        </form>
        
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:text-purple-800">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;