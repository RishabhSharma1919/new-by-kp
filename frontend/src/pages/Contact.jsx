import React from "react";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";

const Contact = () => {
  return (
    <div className="relative bg-transparent px-6 sm:px-12 py-6">
      {/* Title Section with Larger Font */}
      <div className="text-center text-4xl md:text-5xl  pt-8 ">
        <Title text1="CONTACT" text2="US" className="text-5xl md:text-6xl" />
      </div>

      {/* Contact Section */}
      <div className="my-12 flex flex-col md:flex-row gap-10 items-center justify-center">
        {/* Image with a Stylish Frame */}
        <div className="relative w-full md:max-w-[480px]">
          <div className="border-4 border-gray-300 shadow-lg rounded-lg overflow-hidden p-2 bg-transparent">
            <img
              src={assets.contact_img}
              className="w-full h-auto rounded-md"
              alt="Contact Illustration"
            />
          </div>
        </div>

  {/* Contact Information with Transparent Background */}
<div className="flex flex-col gap-8 p-6 md:p-10 shadow-lg rounded-lg max-w-lg w-full border border-gray-500 bg-gray-900/50 backdrop-blur-lg">
  <div>
    <h3 className="text-xl md:text-2xl font-bold text-gray-100">📍 Our Store</h3>
    <p className="text-gray-300 mt-2 leading-relaxed">
      City Center, <br />
      Gwalior, M.P, India
    </p>
  </div>

  <div>
    <h3 className="text-xl md:text-2xl font-bold text-gray-100">📞 Contact Details</h3>
    <p className="text-gray-300 mt-2 leading-relaxed">
      Phone: <a href="tel:+919098007271" className="text-blue-300 hover:text-blue-400 hover:underline">+91 90980 07271</a> <br />
      Email: <a href="mailto:admin@art.com" className="text-blue-300 hover:text-blue-400 hover:underline">admin@art.com</a>
    </p>
  </div>

  <div>
    <h3 className="text-xl md:text-2xl font-bold text-gray-100">💼 Careers at Art</h3>
    <p className="text-gray-300 mt-2 leading-relaxed">
      Learn more about our teams and job openings.
    </p>
  </div>

  {/* Careers Button */}
  <a href="/careers">
    <button className="mt-2 bg-gray-700 text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300">
      Explore Jobs
    </button>
  </a>
</div>


      </div>

      {/* Newsletter Subscription */}
      <div className="mt-12">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Contact;
