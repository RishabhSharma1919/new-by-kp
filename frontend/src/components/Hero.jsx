import React, { useState, useEffect } from 'react';
import { assets } from "../assets/assets";

const Hero = () => {
  // State to track the current image index
  const [currentImage, setCurrentImage] = useState(0);

  // Array of images
  const images = [
    assets.hero5,
    assets.hero6,
    assets.hero2,
    assets.hero7,
  ];

  // Change image every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden courner-rounded hover-fade">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div> {/* Dark overlay */}
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <div className="animate-fadeInUp">
          <p className="text-sm sm:text-base tracking-widest">OUR BESTSELLERS</p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold prata-regular mt-4">
            Latest Arrivals
          </h1>
          <div className="mt-4">
            <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
