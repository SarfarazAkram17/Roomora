"use client";
import Banner from "@/components/Banner";
import Faq from "@/components/Faq";
import FeaturedHotels from "@/components/FeaturedHotels";
import HowItWorks from "@/components/HowItWorks";
import Loader from "@/components/Loader";
import WhyChooseUs from "@/components/WhyChooseUs";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const HomePage = () => {
  const { loading } = useAuth();
  if (loading) return <Loader />;

  return (
    <div className="space-y-12 my-6">
      <Banner />
      <HowItWorks />
      <FeaturedHotels></FeaturedHotels>
      <WhyChooseUs></WhyChooseUs>
      <Faq />
    </div>
  );
};

export default HomePage;