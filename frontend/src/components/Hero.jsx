import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Array of images
  const images = [assets.hero5, assets.hero6, assets.hero2, assets.hero7];

  // Preload images
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  // Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="relative h-auto md:h-[70vh] w-full flex flex-col md:flex-row items-center justify-center pt-10 overflow-hidden">
      {/* Left Side: Image Slideshow with Elegant Frame */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-4">
        <div className="relative w-full max-w-[90%] h-[300px] md:h-[90%] overflow-hidden rounded-xl border-[8px] md:border-[12px] border-[#CDAA7D] shadow-lg">
          <img
            src={images[currentImage]}
            alt="Art Showcase"
            className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          />
        </div>
      </div>

      {/* Right Side: Transparent Quote */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-6 sm:px-12 text-center mt-6 md:mt-0">
        <p
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold opacity-80"
          style={{
            color: "#D6D6C7",
            fontFamily: "serif",
          }}
        >
          "Every artist dips his brush in his own soul, and paints his own nature into his pictures."
        </p>
      </div>
    </div>
  );
};

export default Hero;
