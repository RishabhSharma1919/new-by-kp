import React from "react";
import { assets } from "../assets/assets";
import { Separator } from "@/components/ui/separator"; // ShadCN Separator

const Footer = () => {
  return (
    <footer className="bg-[#1E2222] text-gray-300 py-8">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-10 sm:gap-14 px-6 sm:px-12">
        
        {/* Company Info */}
        <div>
          <img src={assets.logo1} className="mb-4 w-36" alt="ArtYou Logo" />
          <p className="text-sm leading-relaxed text-gray-400">
            Discover unique art pieces and handcrafted designs that bring creativity to life. 
            ArtYou is where passion meets expression.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-white">COMPANY</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-gray-100 transition">Home</a></li>
            <li><a href="/about" className="hover:text-gray-100 transition">About Us</a></li>
            <li><a href="/delivery" className="hover:text-gray-100 transition">Delivery</a></li>
            <li><a href="/privacy-policy" className="hover:text-gray-100 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-white">GET IN TOUCH</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="tel:+12125214569" className="hover:text-gray-100 transition">+1-212-521-4569</a></li>
            <li><a href="mailto:contact@artyou.com" className="hover:text-gray-100 transition">contact@artyou.com</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 px-6">
        <Separator className="bg-gray-600" />
        <p className="py-5 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ArtYou. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
