import React, { useState, useEffect } from 'react';
import { assets } from "../assets/assets";

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Array of images (memoized to avoid unnecessary re-creations)
  const images = [
    assets.hero5,
    assets.hero6,
    assets.hero2,
    assets.hero7,
  ];

  // Preload images to avoid delay during transitions
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  return (
    <div className="relative h-screen w-full overflow-hidden rounded-lg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
        aria-live="polite" // For better accessibility (ensures screen readers know content is changing)
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
