import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Art1 from "../components/Art1";
import Art2 from "../components/Art2";
import Art3 from "../components/Art3";
import Art4 from "../components/Art4";
import Art5 from "../components/Art5";

const Artists = () => {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();

  const toggleSection = (index) => {
    setActiveSection((prev) => (prev === index ? null : index));
  };

  const sections = [
    { name: "Painters", component: <Art1 /> },
    { name: "Sculptors", component: <Art2 /> },
    { name: "Photographers", component: <Art3 /> },
    { name: "Designers", component: <Art4 /> },
    { name: "Illustrators", component: <Art5 /> },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      {sections.map((section, index) => (
        <div
          key={index}
          className="w-full bg-white rounded-lg shadow-md mb-5 p-4 transition-all duration-500"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">{section.name}</h2>
            <button
              onClick={() => toggleSection(index)}
              className={`text-blue-500 underline font-medium ${
                activeSection === index ? "font-bold" : ""
              }`}
              aria-expanded={activeSection === index}
              aria-controls={`section-${index}`}
            >
              {activeSection === index ? "Hide Products" : "Show Products"}
            </button>
          </div>

          {/* Section Content */}
          <div
            id={`section-${index}`}
            className={`mt-4 bg-yellow-200 p-4 transition-all duration-500 ${
              activeSection === index ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
            style={{ overflow: "hidden" }}
          >
            {activeSection === index && section.component}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Artists;
