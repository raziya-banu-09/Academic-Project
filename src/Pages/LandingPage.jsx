import React from "react";
import { motion } from "framer-motion";
import heroImage from "../assets/heroBg.png";
import Button from "../Components/Button";
import Logo from "../Components/Logo";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      
      {/* Header */}
      <header className="shadow-md bg-white sticky top-0 z-50 mb-4 sm:mb-0">
        <Logo />
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 flex-grow gap-12">
        
        {/* Left Content */}
        <motion.div
          className="max-w-xl text-center md:text-left space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}   
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-gray-800 leading-snug">
            Discover, Save & Share Ideas on{" "}
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              PixHub
            </span>
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed font-[Nunito Sans]">
            Explore creative inspiration. Save what you love and share your own
            ideas with others.
          </p>

          {/* Buttons Group */}
          <div className="flex flex-row gap-4 sm:gap-6 justify-center md:justify-start">
            <Link to="/login">
              <Button className="bg-pink-500 cursor-pointer mt-4 text-white rounded-lg hover:bg-pink-600 transition hover:scale-110 ">
                Explore
              </Button>
            </Link> 

            <Link to="/register">
              <Button className="bg-blue-500 cursor-pointer mt-4 text-white rounded-lg hover:bg-blue-600 transition hover:scale-110 ">
                Register
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="flex justify-center md:justify-end w-full md:w-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}  
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <img
            src={heroImage}
            alt="Hero"
            className="w-64 sm:w-80 md:w-[26rem] rounded-3xl hover:scale-105 transition"
          />
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        className="bg-white shadow-inner py-3 text-center text-gray-500 text-sm sm:text-base"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}   // ✅ Slide-up footer
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        © 2025 PixHub — Crafted with ❤️
       
      </motion.footer>
    </div>
  );
}
