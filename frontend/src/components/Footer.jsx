import React from 'react';
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-gray-100 text-gray-600">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm px-4 sm:px-10">
        {/* Company Info */}
        <div>
          <img src={assets.logo1} className="mb-5 w-32" alt="ArtYou Logo" />

          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam itaque distinctio et quas? Voluptatum in sit architecto repellendus similique fugit.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><a href="/" className="hover:text-black">Home</a></li>
            <li><a href="/about" className="hover:text-black">About Us</a></li>
            <li><a href="/delivery" className="hover:text-black">Delivery</a></li>
            <li><a href="/privacy-policy" className="hover:text-black">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><a href="tel:+12125214569" className="hover:text-black">+1-212-521-4569</a></li>
            <li><a href="mailto:contact@artyou.com" className="hover:text-black">contact@artyou.com</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-600">
          Copyright 2024@ artyou.com - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
