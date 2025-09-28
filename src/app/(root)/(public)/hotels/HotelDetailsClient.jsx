"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import axios from "axios";

const HotelDetailsClient = ({ hotel }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(hotel.images[0]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const availableRooms = hotel.totalRooms - (hotel.bookedRooms || 0);

  const { mutate: bookHotel, isPending } = useMutation({
    mutationFn: async (bookingData) => {
      const res = await axios.post(
        `${window.location.origin}/api/bookings`,
        bookingData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking successful!");
      reset();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Booking failed"
      );
    },
  });

  const handleBooking = (data) => {
    if (!user) {
      router.push("/login");
      toast.info("Login first");
      return;
    }

    if (user.role === "admin") {
      return toast.info("You are admin you are not book rooms");
    }

    // Calculate number of nights
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const timeDiff = checkOutDate - checkInDate;
    const numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const bookingData = {
      hotelId: hotel._id,
      hotelName: hotel.name,
      userName: data.name,
      userEmail: data.email,
      rooms: Number(data.rooms),
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      totalPrice: Number(data.rooms) * hotel.pricePerNight * numberOfNights,
      status: "pending",
      payment_status: "pending",
      bookedAt: new Date().toISOString(),
    };

    bookHotel(bookingData);
  };

  return (
    <div className="px-4 my-6 max-w-[1500px] mx-auto space-y-8">
      {/* Hotel images and details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="w-full h-96 relative mb-4">
            <Image
              src={selectedImage}
              alt="Hotel's images"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {hotel.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-28 h-20 sm:w-36 sm:h-28 relative cursor-pointer rounded border-2 ${
                  selectedImage === img ? "border-[#F7602C]" : "border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt="thumbnail"
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Hotel Details */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#F7602C]">{hotel.name}</h1>
          <p className="text-gray-600">{hotel.location}</p>
          <p className="text-xl font-semibold">
            Price: {hotel.pricePerNight} BDT / night
          </p>
          <p className="text-gray-700">{hotel.description}</p>
          <div>
            <h3 className="font-semibold mb-2">Amenities:</h3>
            <ul className="flex flex-wrap gap-2">
              {hotel.amenities.map((a, i) => (
                <li
                  key={i}
                  className="px-3.5 capitalize font-semibold py-0.5 bg-gray-200 rounded-full text-sm"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-green-600 font-medium">
            Available Rooms: {availableRooms}
          </p>
        </div>
      </div>

      {/* booking form */}
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-4 text-[#F7602C]">Book Now</h2>
        <form onSubmit={handleSubmit(handleBooking)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block mb-1">Your Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full border p-2 rounded"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={user?.email}
                readOnly
                {...register("email", { required: "Email is required" })}
                className="w-full border p-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Check-in / Check-out with react-datepicker */}
            <div>
              <label className="block mb-1">Check-in Date</label>
              <Controller
                name="checkIn"
                control={control}
                rules={{ required: "Check-in is required" }}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select check-in date"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    selectsStart
                    startDate={field.value}
                    minDate={new Date()}
                    endDate={null}
                    className="w-full border p-2 rounded"
                    wrapperClassName="w-full"
                    dateFormat="yyyy-MM-dd"
                  />
                )}
              />
              {errors.checkIn && (
                <p className="text-red-500 text-sm">{errors.checkIn.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">Check-out Date</label>
              <Controller
                name="checkOut"
                control={control}
                rules={{ required: "Check-out is required" }}
                render={({ field }) => {
                  const checkInDate = control._formValues?.checkIn;
                  return (
                    <DatePicker
                      placeholderText="Select check-out date"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      selectsEnd
                      startDate={checkInDate}
                      endDate={field.value}
                      minDate={
                        checkInDate
                          ? new Date(
                              new Date(checkInDate).setDate(
                                new Date(checkInDate).getDate() + 1
                              )
                            )
                          : new Date()
                      }
                      className="w-full border p-2 rounded"
                      wrapperClassName="w-full"
                      dateFormat="yyyy-MM-dd"
                    />
                  );
                }}
              />
              {errors.checkOut && (
                <p className="text-red-500 text-sm">
                  {errors.checkOut.message}
                </p>
              )}
            </div>

            {/* Rooms */}
            <div className="md:col-span-2">
              <label className="block mb-1">Number of Rooms</label>
              <input
                type="number"
                {...register("rooms", {
                  required: "Number of rooms is required",
                  min: { value: 1, message: "You must book at least 1 room" },
                  max: {
                    value: availableRooms,
                    message: `You can book at most ${availableRooms} rooms`,
                  },
                })}
                className="w-full border p-2 rounded"
                placeholder="Enter number of rooms you want to book"
              />
              {errors.rooms && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.rooms.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || availableRooms === 0}
            className="w-full bg-[#F7602C]"
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin text-[#F7602C] mr-1" />{" "}
                <span className="animate-pulse">Booking...</span>
              </>
            ) : (
              "Book Now"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HotelDetailsClient;