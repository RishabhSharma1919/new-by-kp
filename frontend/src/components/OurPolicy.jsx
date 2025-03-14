import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange Policy",
      description: "Hassle-free exchanges for all customers.",
    },
    {
      icon: assets.quality_icon,
      title: "Uniqueness in ART",
      description: "We provide one-of-a-kind artwork that stands out.",
    },
    {
      icon: assets.support_img,
      title: "Best Customer Support",
      description: "24/7 assistance available for all your needs.",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-12 text-center py-16 bg-[#262B2B]">
      {policies.map((policy, index) => (
        <div key={index} className="group relative w-56 h-56 perspective-1000">
          {/* Flip Container */}
          <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
            {/* Front Side */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 rounded-xl bg-[#3A3F3F] shadow-lg border border-[#555B5B] transform rotate-y-0 backface-hidden">
              <img src={policy.icon} className="w-16 mb-4" alt={policy.title} />
              <p className="font-semibold text-white">{policy.title}</p>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 flex items-center justify-center p-6 rounded-xl bg-[#E0E0E0] text-black shadow-lg border border-[#555B5B] transform rotate-y-180 backface-hidden">
              <p className="text-sm font-medium">{policy.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;
