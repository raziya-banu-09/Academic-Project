import React from "react";
import { motion } from "framer-motion";
import heroImage from "../assets/heroBg.png";
import Button from "../Components/Button";
import Logo from "../Components/Logo";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#fafafa] overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/login">
              <button className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-pink-500 transition-colors">
                Log in
              </button>
            </Link>
            <Link to="/register">
              <button className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-md hover:shadow-pink-200 hover:scale-105 transition-all">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative max-w-7xl mx-auto w-full px-5 sm:px-10 pt-10 pb-20 flex flex-col md:flex-row items-center gap-14 md:gap-10 flex-grow">

        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -left-24 w-72 h-72 rounded-full bg-pink-200 opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-0 w-64 h-64 rounded-full bg-blue-200 opacity-30 blur-3xl" />

        {/* left */}
        <motion.div
          className="flex-1 text-center md:text-left space-y-7 z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-xs font-bold tracking-widest uppercase">
            ✦ Your creative universe
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Discover, Save &{" "}
            <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              Share Ideas
            </span>{" "}
            on PixHub
          </h1>

          <p className="text-gray-500 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto md:mx-0">
            Explore creative inspiration. Save what you love and share your own
            ideas with others.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/login">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-105 transition-all text-base">
                Start Exploring →
              </button>
            </Link>
            <Link to="/register">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all text-base">
                Create Account
              </button>
            </Link>
          </div>

        </motion.div>

        {/* right image */}
        <motion.div
          className="flex-1 flex justify-center md:justify-end z-10"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
        >
          <div className="relative">
            {/* glow ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-300 via-violet-300 to-blue-300 opacity-40 blur-2xl scale-105" />
            <img
              src={heroImage}
              alt="PixHub preview"
              className="relative w-64 sm:w-80 md:w-[28rem] rounded-3xl shadow-2xl ring-1 ring-white/50 hover:scale-[1.03] transition-transform duration-500"
            />
            {/* floating badge bottom-left */}
            <motion.div
              className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <span className="text-xl">📌</span>
              <div>
                <p className="text-xs text-gray-400">Just saved</p>
                <p className="text-xs font-bold text-gray-800">Morning Mood Board</p>
              </div>
            </motion.div>
            {/* floating badge top-right */}
            <motion.div
              className="absolute -top-4 -right-5 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <span className="text-xl">❤️</span>
              <div>
                <p className="text-xs text-gray-400">Trending</p>
                <p className="text-xs font-bold text-gray-800">+12k saves today</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-white shadow-inner py-3 text-center text-gray-500 text-sm sm:text-base"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        © 2025 PixHub — Crafted with ❤️

      </motion.footer>

    </div>
  );
}