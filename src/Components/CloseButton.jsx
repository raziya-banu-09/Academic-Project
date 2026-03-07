import React from "react";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

const CloseButton = () => {
  return (
    <Link
      to="/home"
      className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/80 text-gray-700 shadow-2xs transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <FiX className="text-2xl font-extrabold" />
    </Link>
  );
};

export default CloseButton;