"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import { FaEye } from "react-icons/fa";

const HotelCard = ({ hotel }) => {
  return (
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
        <h3 className="text-xl font-semibold text-[#F7602C]">{hotel.name}</h3>

        <p className="text-sm text-gray-600 line-clamp-3">
          {hotel.description}
        </p>

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
  );
};

export default HotelCard;
