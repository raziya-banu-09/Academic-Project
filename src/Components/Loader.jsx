import React from "react";
import { motion } from "framer-motion";
import { RiCameraLensAiFill } from "react-icons/ri";

export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      
      <div className="relative flex items-center justify-center">

        {/* Outer Glow */}
        <div className="absolute w-32 h-32 bg-blue-400 opacity-20 blur-2xl rounded-full animate-pulse"></div>

        {/* Rotating Ring */}
        <motion.div
          className="absolute w-24 h-24 border-4 border-t-blue-500 border-b-pink-500 border-l-transparent border-r-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />

        {/*Pulsing Inner Circle */}
        <motion.div
          className="absolute w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full opacity-80"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />

        {/*Camera Icon */}
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <RiCameraLensAiFill className="text-4xl text-white relative z-10" />
        </motion.div>

      </div>

    </div>
  );
}