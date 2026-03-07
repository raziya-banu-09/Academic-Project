import React from "react";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import Button from "../Components/Button";
import axios from "axios";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Enter details to login");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7148/api/User/login",
        {
          username: username,
          password: password
        }
      );

      // store JWT token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      navigate("/home");

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid credentials");
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 items-center justify-center px-4">
      <motion.div
        className="relative bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-sm space-y-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Close Button */}
        <Link to="/">
          <button
            className="absolute cursor-pointer top-4 right-4 text-2xl font-bold text-blue-900 hover:text-blue-700"
          >
            ✕
          </button>
        </Link>

        {/* Logo */}
        <div className="flex justify-center mb-1">
          <Logo />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Login to <span className="text-pink-500">Explore</span>
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username:
            </label>
            <div className="relative">
              <input type="text" id="username" placeholder="Enter username" autoComplete="username"
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaUser className="absolute right-3 top-3 text-gray-400 text-xl" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input type="password" id="password" placeholder="**********" autoComplete="current-password"
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-right text-sm text-blue-600 cursor-pointer hover:underline">
              Forgot Password?
            </p>
          </div>

          {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}

          {/* Login Button */}
          <Button type="submit"
            className="w-full cursor-pointer font-[Arial] bg-blue-500 mt-1 font-medium text-white hover:bg-blue-600 transition hover:scale-105">
            Login
          </Button>

          {/* Register Prompt */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-pink-500 hover:underline font-medium">
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
