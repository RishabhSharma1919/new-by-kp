import React from "react";
import { assets } from "../assets/assets";

const Hero2 = () => {
  return (
    <div className="relative h-auto md:h-[70vh] w-full flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 overflow-hidden">
      {/* Left Side: Text Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start space-y-4">
        <h2 className="text-3xl sm:text-5xl font-bold text-[#D6D6C7]">
          Get yourself a personalized painting, sketch for yourself
        </h2>
        <p className="text-lg sm:text-2xl italic opacity-80 text-[#D6D6C7]">
          "Art enables us to find ourselves and lose ourselves at the same time."
        </p>
      </div>

      {/* Right Side: Fixed Positioned Images */}
      <div className="relative w-full md:w-1/2 h-[300px] md:h-[500px] flex items-center justify-center">
        {/* Image 1 - Top Left */}
        <img
          src={assets.hero21}
          alt="Art 1"
          className="absolute top-0 left-10 w-[120px] sm:w-[150px] rounded-lg shadow-lg"
        />
        {/* Image 2 - Center */}
        <img
          src={assets.hero22}
          alt="Art 2"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[140px] sm:w-[180px] rounded-lg shadow-lg"
        />
        {/* Image 3 - Bottom Right */}
        <img
          src={assets.hero23}
          alt="Art 3"
          className="absolute bottom-0 right-10 w-[120px] sm:w-[150px] rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Hero2;
