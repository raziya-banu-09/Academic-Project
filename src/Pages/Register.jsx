import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import Logo from "../Components/Logo";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7148/api/User/register",
        {
          username: username,
          email: email,
          password: password
        }
      );

      navigate("/login");

    } catch (err) {
      console.log(err);
      setError("Registration failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 items-center justify-center px-4 py-8">
      <motion.div
        className="relative bg-white shadow-xl rounded-2xl p-4 w-full max-w-[400px]  space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Close Button - Top Right */}
        <Link to="/">
          <button
            className="absolute top-4 right-4 text-2xl cursor-pointer font-bold text-blue-900 hover:text-blue-700"
          >
            ✕
          </button>
        </Link>

        <div className="ml-0 mr-0 md:ml-7 md:mr-7">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <Logo />
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            Create Your Account
          </h2>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block mt-3 text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                  className="w-full px-3 py-2 pr-9 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
                <MdEmail className="absolute right-2 top-2.5 text-gray-400 text-lg" />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  placeholder="Enter username"
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  autoComplete="username"
                  className="w-full px-3 py-2 pr-9 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
                <FaUser className="absolute right-2 top-2.5 text-gray-400 text-lg" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="**********"
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="**********"
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-xs">{error}</p>}

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer font-[Arial] bg-blue-500 mt-3 font-medium text-white hover:bg-blue-600 transition-transform duration-200 hover:scale-105 text-sm py-2"
            >
              Register
            </Button>

            {/* Login Prompt */}
            <p className="text-center text-xs sm:text-sm text-gray-600 mt-1">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-500 hover:underline font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
