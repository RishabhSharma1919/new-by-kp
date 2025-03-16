import React from 'react'
import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import Art1 from '../components/Art1';
import Hero2 from '../components/Hero2';
import { CheckoutButton } from '../components/CheckoutButton';

const Home = () => {
  return (
    <div>
     {/* <CheckoutButton/> */}
      <Hero />
      <div className="bg-[#F9F9F9]"> {/* Ensures background applies */}
        <LatestCollection />
      </div>
      <BestSeller />
      <Hero2/>
      <Art1 />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};


export default Home

