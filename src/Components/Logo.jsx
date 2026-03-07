import React from 'react';
import { RiCameraLensFill } from 'react-icons/ri';
const Logo = () => {
  return (
    <header >
      <div className="max-w-7xl h-13 mx-auto flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 text-2xl md:text-3xl font-bold ml-3.5">
          {/* Icon */}
         <RiCameraLensFill className="text-pink-500 text-3xl md:text-4xl" />
          
          {/* Text */}
          <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-pink-500 to-blue-500 cursor-default">
            PixHub
          </span>
        </div>
      </div>
    </header>
  );
};
export default Logo;