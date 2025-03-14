import React from "react";
import Art1 from "../components/Art1";
import Art2 from "../components/Art2";
import Art3 from "../components/Art3";
import Art4 from "../components/Art4";
import Art5 from "../components/Art5";
import Title from "../components/Title";

const Artists = () => {
  const sections = [
    { name: "Painters", component: <Art1 /> },
    { name: "Sculptors", component: <Art2 /> },
    { name: "Photographers", component: <Art3 /> },
    { name: "Designers", component: <Art4 /> },
    { name: "Illustrators", component: <Art5 /> },
  ];

  return (
    <div className="w-full min-h-screen bg-transparent relative px-6 sm:px-12 py-12">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 -z-10"></div>

      {/* Title Section */}
      <div className="text-center text-5xl py-8">
      <Title text1="Our" text2="Artists" className="text-6xl md:text-7xl" />       
       <p className="text-gray-200 mt-3 text-lg md:text-xl">
          Discover talent from various art disciplines
        </p>
      </div>

      {/* Artist Sections (Glassmorphism Cards) */}
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md shadow-lg border border-white/20 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-white">{section.name}</h2>
            <div className="bg-white/20 p-4 rounded-md">{section.component}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artists;
