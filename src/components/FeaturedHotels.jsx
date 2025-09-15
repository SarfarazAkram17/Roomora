import React from "react";
import HotelCard from "./HotelCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const FeaturedHotels = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["featuredHotels"],
    queryFn: async () => {
      const res = await axios.get(
        `${window.location.origin}/api/hotels/random`
      );
      return res.data;
    },
    keepPreviousData: true,
  });
console.log(data)
  const hotels = data?.hotels || [];

  return (
    <div className="px-4 max-w-[1500px] mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#F7602C] mb-10">
        Featured Hotels
      </h2>

      {isLoading ? (
        <p className="text-center text-lg animate-pulse text-gray-600">
          Loading...
        </p>
      ) : hotels.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No hotels available yet.
        </p>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedHotels;