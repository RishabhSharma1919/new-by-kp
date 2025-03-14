import React, { useState } from "react";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setIsSubscribed(true);
      setEmail(""); // Clear input after successful subscription
      setTimeout(() => setIsSubscribed(false), 4000); // Hide message after 4 sec
    } else {
      alert("Please enter a valid email.");
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  return (
    <div className="text-center py-10 px-6 bg-[#262B2B] text-white rounded-lg shadow-lg">
      <p className="text-2xl font-semibold">Subscribe now & get up to 20% off</p>
      <p className="text-gray-300 mt-3">
        Stay updated with our latest artwork, exclusive offers, and more!
      </p>

      {isSubscribed ? (
        <p className="text-green-400 mt-4 text-lg animate-fadeIn">
          ✅ You have successfully subscribed!
        </p>
      ) : (
        <form
          onSubmit={onSubmitHandler}
          className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-gray-500 rounded-lg p-2"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full outline-none bg-transparent text-white placeholder-gray-400 px-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
            aria-label="Subscribe to newsletter"
          >
            SUBSCRIBE
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterBox;
