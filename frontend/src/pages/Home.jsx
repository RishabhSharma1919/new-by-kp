import React from 'react'
import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import Art1 from '../components/Art1';

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <Art1/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home
