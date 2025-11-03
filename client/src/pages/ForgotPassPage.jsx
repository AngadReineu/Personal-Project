import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import login from "../assets/login.webp";

const ForgotPassPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:9000/api/users/forgot-password",
        { email }
      );
      setMessage(res.data.message || "If this email is registered, a reset link has been sent.");
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Left side form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-300 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-2xl font-semibold">Forgot Password</h2>
          </div>

          <p className="text-center mb-6 text-gray-600">
            Enter your registered email address and we’ll send you a link to reset your password.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Enter Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              required
            />
          </div>

          {message && (
            <p className="text-sm text-center mb-4 text-green-600">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm text-blue-500 hover:text-blue-700 hover:underline transition"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>

      {/* Right side image */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Forgot password"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
