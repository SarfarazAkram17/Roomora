"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { Pagination } from "antd";
import { FaEye } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

const AllHotels = () => {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1);
  const router = useRouter();

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
    <div className="px-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="border h-full rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-500"
              >
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-full h-52 sm:h-60 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold text-[#F7602C]">
                    {hotel.name}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3">{hotel.description}</p>

                  <p className="text-sm">
                    <strong>Price per night:</strong> ৳{hotel.pricePerNight}
                  </p>

                  <div className="mt-4">
                    <Link href={`/hotels/${hotel._id}`}>
                      <Button
                        variant="contained"
                        sx={{ fontSize: "12px" }}
                        className="text-white"
                      >
                        <FaEye size={15} className="mr-1" /> Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
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