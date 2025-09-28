import Banner from "@/components/Banner";
import Faq from "@/components/Faq";
import FeaturedHotels from "@/components/FeaturedHotels";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import React from "react";

const HomePage = () => {
  return (
    <div className="space-y-12 my-6">
      <div className="px-4">
        <Banner />
      </div>
      <HowItWorks />
      <FeaturedHotels></FeaturedHotels>
      <WhyChooseUs></WhyChooseUs>
      <Faq />
    </div>
  );
};

export default HomePage;