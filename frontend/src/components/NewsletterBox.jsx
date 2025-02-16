import React, { useState } from 'react';

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setIsSubscribed(true);
    } else {
      alert('Please enter a valid email.');
    }
  };

  const validateEmail = (email) => {
    // Simple regex for email validation
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get upto 20% off
      </p>
      <p className="text-gray-400 mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, deserunt labore. Exercitationem doloribus molestias blanditiis nisi veniam repudiandae ducimus id asperiores nulla at. Et, odio. Quasi nobis hic distinctio facilis!
      </p>

      {isSubscribed ? (
        <p className="text-green-500 mt-3">You have successfully subscribed!</p>
      ) : (
        <form
          onSubmit={onSubmitHandler}
          className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 outline-none min-w-0"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-black text-white text-sm px-4 py-2"
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
