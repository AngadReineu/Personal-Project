import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import login from "../assets/login.webp";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPassPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border-gray-300 shadow-sm relative"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Reset Password</h2>
          </div>

          <p className="text-center mb-6 text-gray-600">
            Enter your new password below to reset your account credentials.
          </p>

          {/* New Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold mb-2">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter new password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600 hover:text-gray-800"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>
            {password && password.length < 6 && (
              <p className="text-sm text-red-500 mt-1">
                Minimum 6 characters required.
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Confirm new password"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600 hover:text-gray-800"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </span>
          </div>

          {/* Message */}
          {message && (
            <p className="text-center text-sm text-gray-700 mt-3">{message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>

      {/* Right Section (Image) */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Reset Password"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassPage;
