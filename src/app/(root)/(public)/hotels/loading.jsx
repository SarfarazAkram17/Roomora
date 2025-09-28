"use client";
import { Button } from "@mui/material";
import DatePicker from "react-datepicker";

const Loading = () => {
  return (
    <div className="px-4 my-6 max-w-[1500px] mx-auto space-y-8">
      {/* Hotel images and details */}
      <div className="grid md:grid-cols-2 gap-6 animate-pulse">
        {/* Image Skeleton */}
        <div>
          <div className="w-full h-96 bg-gray-300 rounded-lg mb-4"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="w-28 h-20 sm:w-36 sm:h-28 bg-gray-300 rounded"
              ></div>
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-300 rounded"></div>{" "}
          {/* Hotel name */}
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div> {/* Location */}
          <div className="h-6 w-1/3 bg-gray-300 rounded"></div> {/* Price */}
          <div className="h-40 w-full bg-gray-300 rounded"></div>{/* Description */}          
          <div>
            <div className="h-5 w-1/4 bg-gray-300 rounded mb-2"></div>{" "}
            {/* Amenities heading */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-16 bg-gray-300 rounded-full"
                ></div>
              ))}
            </div>
          </div>
          <div className="h-5 w-1/4 bg-gray-300 rounded"></div>{" "}
          {/* Available rooms */}
        </div>
      </div>

      {/* booking form */}
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4 text-[#F7602C]">Book Now</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block mb-1">Your Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Check-in / Check-out with react-datepicker */}
            <div>
              <label className="block mb-1">Check-in Date</label>
              <DatePicker
                className="w-full border p-2 rounded"
                placeholderText="Select check-in date"
                wrapperClassName="w-full"
              />
            </div>

            <div>
              <label className="block mb-1">Check-out Date</label>

              <DatePicker
                className="w-full border p-2 rounded"
                placeholderText="Select check-out date"
                wrapperClassName="w-full"
              />
            </div>

            {/* Rooms */}
            <div className="md:col-span-2">
              <label className="block mb-1">Number of Rooms</label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Enter number of rooms you want to book"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            className="w-full bg-[#F7602C]"
          >
            Book Now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Loading;