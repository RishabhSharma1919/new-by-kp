import React from "react";
import { assets } from "../assets/assets";

const openImage = (imgSrc) => {
  const newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>Image Preview</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; margin: 0; flex-direction: column; }
            img { max-width: 90%; max-height: 80vh; border-radius: 10px; box-shadow: 0 0 15px rgba(255, 255, 255, 0.3); }
            button { margin-top: 20px; padding: 10px 20px; font-size: 16px; border: none; background: #D6D6C7; color: #000; cursor: pointer; border-radius: 5px; }
            button:hover { background: #bdbdaa; }
          </style>
        </head>
        <body>
          <img src="${imgSrc}" alt="Art Preview" />
          <button onclick="window.close()">Go Back</button>
        </body>
      </html>
    `);
  }
};

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

      {/* Right Side: Images */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center">
        {/* Small screens: Images aligned in a row */}
        <div className="flex md:hidden gap-3">
          {[assets.hero21, assets.hero22, assets.hero23].map((imgSrc, index) => (
            <img
              key={index}
              src={imgSrc}
              alt={`Art ${index + 1}`}
              className="w-[100px] sm:w-[120px] rounded-lg shadow-lg cursor-pointer"
              onClick={() => openImage(imgSrc)}
            />
          ))}
        </div>

        {/* Medium & Large screens: Images in absolute positions */}
        <div className="hidden md:block relative w-full h-[500px]">
          <img
            src={assets.hero21}
            alt="Art 1"
            className="absolute top-0 left-10 w-[120px] sm:w-[150px] rounded-lg shadow-lg cursor-pointer"
            onClick={() => openImage(assets.hero21)}
          />
          <img
            src={assets.hero22}
            alt="Art 2"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[140px] sm:w-[180px] rounded-lg shadow-lg cursor-pointer"
            onClick={() => openImage(assets.hero22)}
          />
          <img
            src={assets.hero23}
            alt="Art 3"
            className="absolute bottom-0 right-10 w-[120px] sm:w-[150px] rounded-lg shadow-lg cursor-pointer"
            onClick={() => openImage(assets.hero23)}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero2;
