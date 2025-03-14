import React from "react";
import { Particles } from "@magiclabs/ui";

const ParticleBackground = () => {
  return (
    <div className="relative w-full h-screen">
      <Particles
        id="particles"
        className="absolute inset-0"
        options={{
          particles: {
            number: {
              value: 100, // Number of particles
            },
            size: {
              value: 3, // Particle size
            },
            move: {
              speed: 2, // Motion speed
            },
            color: {
              value: "#ffffff", // Particle color
            },
          },
        }}
      />
      <div className="relative z-10 flex items-center justify-center h-full text-white text-3xl">
        Welcome to My Website
      </div>
    </div>
  );
};

export default ParticleBackground;
