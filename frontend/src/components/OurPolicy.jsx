import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div className="hover:scale-105 transition-all duration-300 ease-in-out">
        <img
          src={assets.exchange_icon}
          className="w-12 m-auto mb-5"
          alt="Easy Exchange Policy Icon"
        />
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-400">We offer hassle-free exchange policy.</p>
      </div>

      <div className="hover:scale-105 transition-all duration-300 ease-in-out">
        <img
          src={assets.quality_icon}
          className="w-12 m-auto mb-5"
          alt="7 Days Return Policy Icon"
        />
        <p className="font-semibold">Uniqueness in ART</p>
        <p className="text-gray-400">We provide unique Artwork.</p>
      </div>

      <div className="hover:scale-105 transition-all duration-300 ease-in-out">
        <img
          src={assets.support_img}
          className="w-12 m-auto mb-5"
          alt="Best Customer Support Icon"
        />
        <p className="font-semibold">Best Customer Support</p>
        <p className="text-gray-400">We provide 24/7 customer support.</p>
      </div>
    </div>
  );
};

export default OurPolicy;
