"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "antd";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Loader from "@/components/Loader";
import HotelCard from "@/components/HotelCard";

const AllHotels = () => {
  const { loading } = useAuth();
  const [page, setPage] = useState(1);

  // Fetch hotels
  const { data, isLoading } = useQuery({
    queryKey: ["hotels", page],
    queryFn: async () => {
      const res = await axios.get(`${window.location.origin}/api/hotels`, {
        params: { page, limit: 12 },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const hotels = data?.hotels || [];
  const total = data?.total || 0;

  if (loading || isLoading) return <Loader />;

  return (
    <div className="px-4 my-6 max-w-[1500px] mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#F7602C] mb-10">
        All Hotels
      </h2>

      {hotels.length === 0 ? (
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

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <Pagination
              current={page}
              align="center"
              total={total}
              pageSize={12}
              showSizeChanger={false}
              onChange={(newPage) => {
                setPage(newPage);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AllHotels;
